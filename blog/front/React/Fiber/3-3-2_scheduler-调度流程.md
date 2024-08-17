---
difficulty: hard
type: origin
pre: +/front/React/Fiber/3-3-1_scheduler-优先级与准备阶段
rear: +/front/React/Fiber/3-4-1_双缓存机制
---

# scheduler 调度流程

> 主要源码: [ReactFiberWorkLoop](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js)

这章系统地讲一下，scheduler 处理异步任务的流程，了解在时间片内如何进行工作循环。

## scheduleCallback

react 处理同步任务的逻辑比较简单: 将任务加入到任务队列中，然后一一执行。处理异步任务就比较复杂，因为涉及到优先级，核心方法就是 `scheduleCallback`（[✨约322行](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js#L322)）:

```ts
function scheduleCallback( priorityLevel: PriorityLevel, callback: RenderTaskFn ) {
  return Scheduler_scheduleCallback(priorityLevel, callback);
}
```

```ts
// 就是上文的 Scheduler_scheduleCallback 名字不一样
function unstable_scheduleCallback(
  priorityLevel: PriorityLevel,
  callback: Callback,
  options?: {delay: number},
): Task {
  // 当前程序执行时间
  var currentTime = getCurrentTime();
  var startTime;
  // 一般都不会传 options 参数
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  var timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT; // -1
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT; // 250
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT; // 0b111111111111111111111111111111
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT; // 10000
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT; // 5000
      break;
  }

  // 到期时间 = 开始时间 + 优先级延期时间
  var expirationTime = startTime + timeout;

  // 创建一个任务
  var newTask: Task = {
    id: taskIdCounter++,  // 任务 Id
    callback, // 回调
    priorityLevel,  // 优先级
    startTime,  // 开始时间
    expirationTime, // 到期时间
    sortIndex: -1,  // 排序索引，越小的排在队列前面
  };

  // 是个延时任务，加入到延时队列中
  if (startTime > currentTime) {
    newTask.sortIndex = startTime;
    // 这里的 timerQueue 和 taskQueue 是两个小根堆
    push(timerQueue, newTask);
    // 检查当前任务是否为下一个待执行的任务
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // 取消之前的超时回调
      if (isHostTimeoutScheduled) {
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // 安排一个新的超时回调
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // 正常任务：直接加入到任务队列
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    // 如果host主机回调任务还没有被调度 且 当前并未在工作中；则需要开启一个host主机回调任务
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback();
    }
  }

  return newTask;
}
```

这个方法就干了几件事: 创建任务，调度任务，最后把这个任务返回。`Task` 的 `callback` 是指 `performConcurrentWorkOnRoot` 函数(下一篇文章会讲)。

### requestHostCallback

下面看一下 `requestHostCallback` 这个方法，它会拿一个任务出来等主线程空闲时执行。

```ts
function requestHostCallback() {
  // 判断消息循环是否在运行中，没有则开启
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    // 调度异步执行，创建新的宏任务
    schedulePerformWorkUntilDeadline();
  }
}
```

重点是 `schedulePerformWorkUntilDeadline` ([✨约516行](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js#L516)):

```ts
let schedulePerformWorkUntilDeadline;
if (typeof localSetImmediate === 'function') {
  // Node.js 与旧版 IE 浏览器
  schedulePerformWorkUntilDeadline = () => {
    localSetImmediate(performWorkUntilDeadline);
  };
} else if (typeof MessageChannel !== 'undefined') {
  // 常规浏览器 DOM 环境
  const channel = new MessageChannel();
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    channel.port2.postMessage(null);
  };
} else {
  // 其他环境
  schedulePerformWorkUntilDeadline = () => {
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}
```

在浏览器 DOM 中，react 的 `schedule` 采用 `MessageChannel` 生成宏任务。

<p class="tip">这里有个问题：react 把异步任务放到宏任务队列里了。讲道理，异步微任务应该放到微任务队列里面。但由于一次事件循环要执行完(冲刷)所有的微任务，微任务可能产生新的微任务，这会导致有很多微任务需要执行，一个时间片内无法执行完，因此索性放宏任务队列里等下一次事件循环执行。</p>

### MessageChannel

这里我们先说一下为什么使用 `MessageChannel` 创建宏任务，而不是其他 API:
- `requestIdleCallback`: 这个仅帧时间有空闲时间时才会执行，执行频率不稳定。
- `requestAnimationFrame`: 这个函数是给渲染过程做预操作的，并不是所有帧都需要渲染，而且它的执行效率不高。
- `setImmediate`: node 环境是使用的 `setImmediate` 调度宏任务，因为他不会阻止 node 进程推出。
- `setTimeout`: W3C 规定这个 API 需要 4ms 的最小间隔，这个时间会被浪费。

然后我们简单说一下 `MessageChannel`，它是 DOM 的一个原生 API，允许我们在不同的浏览器上下文之间建立管道并通信，同时它支持 worker 线程(可以实现真正的并行)。

MessageChannel 有两个属性: `port1`, `port2` 表示通道的两个端口，还有两个方法: `close` 用于关闭通道，释放资源；`onmessageerror` 用于处理序列化失败的情形。两个端口可以互相收发消息:
- `onmessage`: 事件处理函数
- `postmessage`: 发送事件函数
- `start/close`: 启动与关闭端口

所以这段代码的执行逻辑就是:

```ts
// 创建通道
const channel = new MessageChannel();
const port = channel.port2;
// 通道1回调函数: 执行任务直到时间片结束
channel.port1.onmessage = performWorkUntilDeadline;
// 通道2啥也不传，仅告诉通道1要执行你的方法了
schedulePerformWorkUntilDeadline = () => {
  port.postMessage(null);
};
```

`schedulePerformWorkUntilDeadline` 在执行后会产生一个宏任务，并告诉 port1，执行你的回调。所以说 `MessageChannel` 就干了一件事: 创建宏任务。

## performWorkUntilDeadline

这个方法直译可以说成: 干活到死😂。它是 react 实现时间片内执行任务的核心方法，作用为: 在规定时间片内执行任务（[✨约488行](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js#L488)）。

```ts
const performWorkUntilDeadline = () => {
  if (isMessageLoopRunning) {
    const currentTime = getCurrentTime();
    startTime = currentTime;

    let hasMoreWork = true;
    try {
      // 执行任务，判断是否还有未执行的
      hasMoreWork = flushWork(currentTime);
    } finally {
      if (hasMoreWork) {
        // 有没执行完的，下一轮宏任务继续更新
        schedulePerformWorkUntilDeadline();
      } else {
        // 停止工作循环
        isMessageLoopRunning = false;
      }
    }
  }
  needsPaint = false;
};
```

### flushWork

来看一下工作是怎样执行的（[✨约144行](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js#L144)）:

```ts
function flushWork(initialTime: number) {
  // 保证每次更新需要调度一个Host主机回调任务
  isHostCallbackScheduled = false;
  // 设置状态: 正在干活中
  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    // 执行工作循环
    return workLoop(initialTime);
  } finally {
    // 清除当前任务
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    // 设置执行状态: 停止
    isPerformingWork = false;
  }
}
```

### workLoop

继续看最重要的 `workLoop` 方法（[✨约188行](https://github.com/facebook/react/blob/main/packages/scheduler/src/forks/Scheduler.js#L188)）:

```ts
function workLoop(initialTime: number) {
  let currentTime = initialTime;
  // 从 timerQueue 中取出到期的任务加入到 taskQueue
  advanceTimers(currentTime);
  // 拿优先级最高的一个任务
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    // 任务没有到执行的时间且时间片用完了，退出
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      break;
    }

    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      // 判断当前任务是否已过期
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      // 执行任务
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === 'function') {
        // 任务返回值是个函数，说明任务没完成，要继续干
        currentTask.callback = continuationCallback;
        advanceTimers(currentTime);
        return true;
      } else {
        if (currentTask === peek(taskQueue)) {
          // 弹栈，说明这个任务处理完了
          pop(taskQueue);
        }
        advanceTimers(currentTime);
      }
    } else {
      // 不是个函数，说明不是个任务，直接弹出去
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  // 到这说明任务全做完了，或者时间片用完了
  if (currentTask !== null) {
    return true;  // 没干完
  } else {
    // 干完了
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}
```

这是 schedular 的核心方法，通过一个 `while` 循环不断取任务执行。下面看一下 `shouldYieldToHost` 这个方法如何判断时间片是否用完。

```ts
function shouldYieldToHost(): boolean {
  const timeElapsed = getCurrentTime() - startTime;
  return timeElapsed >= frameInterval;  // 5ms
}
```

很简单，从任务开始到当前任务超过 5ms，时间片就用完了。配上一张流程图:

![任务循环执行过程](https://pionpill-1316521854.cos.ap-shanghai.myqcloud.com/blog%2Fdiagrams%2Ffront%2FReact%2Fworkloop.svg)

我们了解了异步任务调度逻辑，我们需要牢记以下几个方法：
- `scheduleCallback`/`Scheduler_scheduleCallback`: 开启异步宏任务调度流程
  - 上一节提到的 `scheduleImmediateTask` 会调用这个方法
- `schedulePerformWorkUntilDeadline`/`performWorkUntilDeadline`: 会触发宏任务

## 执行宏任务或微任务

在上一节中，React 创建了微任务去调度立即执行的任务，在本节，React 使用 `MessageChannel` 创建宏任务执行 `workLoop`。这两者有什么区别呢？
- 微任务：当前事件循环需要执行完成的任务，会阻塞 UI 渲染，适用于需要立即执行的逻辑
- 宏任务：下一轮事件循环执行的任务，不会阻塞当前的 UI 渲染，适用于不紧急或者可以延迟执行的逻辑

创建微任务可以立即执行对应的逻辑，但这是有代价的，微任务必须在本轮事件循环执行，也即在当前帧任务中执行完。如果一个存在微任务处理很慢，多个微任务需要处理，微任务产生微任务的情形，必然会出现长任务，导致浏览器帧卡顿，这和 React 的设计原则是相悖的。

上一节的 `scheduleImmediateTask` 方法创建了微任务去处理 `scheduleCallback`，但 `scheduleCallback` 本身是宏任务处理，为什么要这样做？因为从 `scheduleImmediateTask` 到宏任务执行完毕，再从微任务开启到执行  `scheduleCallback` 过程中还有很多其他逻辑要处理。