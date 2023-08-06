---
difficulty: medium
type: note
pre: +/front/Vue/Vue2/6-1-1_vue-class-component
---

# vue-property-decorator

> 组件官方仓库readme(英): [https://github.com/kaorun343/vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

该组件基于 vue-class-component 组件，在此基础上增加了更多的装饰器。

## 属性
### `@Prop`

- 类型: `@Prop(options: (PropOptions | Constructor[] | Constructor) = {})`

`@Prop` 是这个组件最常用的功能，它接受一个对象作为参数，用于对要传入的外部属性进行配置，配置方法和 props API 类似:

```ts
@Prop({ default: 'default value' }) readonly propB!: string
```

无法像这样指定默认值: `@Prop() prop = 'default value'`，如果这样写就无法区分 props 和 data 了。

### `@PropSync`

- 类型: `@PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {})`

`@PropSync` 在 `@Prop` 基础上创建了该属性的 getter 与 setter 计算属性。这使得我们可以像操作 data 一样操作该 prop，同时就像在父组件中绑定时增加了 `.sync` 修饰。

```ts
@PropSync('name', { type: String }) syncedName!: string
```

等价于

```ts
props: {
  name: {
    type: String,
  },
},
computed: {
  syncedName: {
    get() {
      return this.name
    },
    set(value) {
      this.$emit('update:name', value)
    },
  },
},
```

### `@Emit`

- 类型: `@Emit(event?: string)`

向父组件发送事件:
- 接受一个事件名作为参数，如果没有，则将被修饰的函数名改为 kebab-case 写法作为事件名。
- 将被修饰函数的返回值作为 emit 的参数。
- 如果没有返回值，将函数参数作为 emit 的参数。

```ts
@Emit()
addToCount(n: number) {
  this.count += n
}
@Emit('reset')
resetCount() {
  this.count = 0
}
@Emit()
returnValue() {
  return 10
}
```

```ts
addToCount(n) {
  this.count += n
  this.$emit('add-to-count', n)
},
resetCount() {
  this.count = 0
  this.$emit('reset')
},
returnValue() {
  this.$emit('return-value', 10)
},
```


## 双向绑定
### `@Model`

- 类型: `@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {})`

直接看等价代码:

```ts
@Component
export default class YourComponent extends Vue {
  @Model('change', { type: Boolean }) readonly checked!: boolean
}
```

```ts
export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: {
      type: Boolean,
    },
  },
}
```

### `@VModel`

- 类型: `@VModel(propsArgs?: PropOptions)`

```ts
@VModel({ type: String }) name!: string
```

```ts
props: {
  value: {
    type: String,
  },
},
computed: {
  name: {
    get() {
      return this.value
    },
    set(value) {
      this.$emit('input', value)
    },
  },
},
```

### `@ModelSync`

- 类型: `@ModelSync(propName: string, event?: string, options: (PropOptions | Constructor[] | Constructor) = {})`

和 `@PropSync` 类似，是前两种装饰器的合体:

```ts
import { Vue, Component, ModelSync } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @ModelSync('checked', 'change', { type: Boolean })
  readonly checkedValue!: boolean
}
```

```ts
export default {
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: {
      type: Boolean,
    },
  },
  computed: {
    checkedValue: {
      get() {
        return this.checked
      },
      set(value) {
        this.$emit('change', value)
      },
    },
  },
}
```

## 监听
### `@Watch`

- @Watch(path: string, options: WatchOptions = {})

对应 Vue 的 watch API，第一个参数为监听对象，第二个为配置对象。

```ts
@Component
export default class YourComponent extends Vue {
  @Watch('person', { immediate: true, deep: true })
  onPersonChanged(val: Person, oldVal: Person) {}

  @Watch('person')
  @Watch('child')
  onPersonAndChildChanged() {}
}
```

```ts
export default {
  watch: {
    child: [
      {
        handler: 'onPersonAndChildChanged',
        immediate: false,
        deep: false,
      },
    ],
    person: [
      {
        handler: 'onPersonChanged',
        immediate: true,
        deep: true,
      },
      {
        handler: 'onPersonAndChildChanged',
        immediate: false,
        deep: false,
      },
    ],
  },
  methods: {
    onPersonChanged(val, oldVal) {},
    onPersonAndChildChanged() {},
  },
}
```

## 依赖注入

<p class="hint">原理都类似，这里就不贴代码了。</p>

### `@Provide` `@Inject`

- 类型: `@Provide(key?: string | symbol) / @Inject(options?: { from?: InjectKey, default?: any } | InjectKey)`

### `@ProvideReactive` `@InjectReactive`

- 类型: `@ProvideReactive(key?: string | symbol) / @InjectReactive(options?: { from?: InjectKey, default?: any } | InjectKey)`

`@Provide` 与 `@Inject` 的响应式版，如果父组件改变了值，子组件会捕捉到这些改变。

## 引用
### `@Ref`

- 类型: `@Ref(refKey?: string)`

在组件的 `this.$refs` 中创建新的引用对象，接受一个参数作为 ref 名，如果没有则使用被修饰的属性名。

```ts
@Ref() readonly anotherComponent!: AnotherComponent
@Ref('aButton') readonly button!: HTMLButtonElement
```

```ts
computed() {
  anotherComponent: {
    cache: false,
    get() {
      return this.$refs.anotherComponent as AnotherComponent
    }
  },
  button: {
    cache: false,
    get() {
      return this.$refs.aButton as HTMLButtonElement
    }
  }
}
```

由于是计算属性，可以直接通过引用名访问到。