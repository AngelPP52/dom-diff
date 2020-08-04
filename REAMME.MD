# 全面拥抱DOM-Diff

> 灵魂拷问1：DOM-Diff比对的是啥？
> 回答：当然是**虚拟DOM**呀！

> 灵魂拷问2：那虚拟DOM都有啥属性？
> 回答：好像有**type**，**props**，**ref**...

> 灵魂拷问3：如何判断两个节点是否一样？
> 回答：**判断空值**呗，如果新老节点其中有一个为空，那肯定不一样；还有就是**判断type**呗，类型不一样，那肯定不一样；如果类型一致，应该要**判断props的孩子和属性**囖，其中一个不一样，那肯定不一样。那还有吗？...

> 灵魂拷问4：当比对的虚拟DOM类型一致时，普通节点（文本节点或标签节点）和组件节点的比对方式一样吗？
> 回答：当然不一样啦。因为普通节点可能只需要简单替换，如果普通节点有孩子有属性，则递归对比更新孩子和更新属性后，普通节点就处理完成了；但是，组件节点不同，这需要考虑类组件的生命周期、类组件是否批量更新以及计算最终组件状态，不能简单对比更新孩子和属性就完事了。

> 灵魂拷问5：如何进行比对并且更新孩子节点？
>
> 回答：如果新老节点的孩子都是文本节点则直接替换，如果不是，依次比对（TODO）



## 简版DOM-Fiff

> 为什么有这个简版？完全是因为我还没有接触过DOM-Diff，所以只好先整理简版的啦...

### 比较新老节点

*注意1：删除老节点的时候，如果是类组件，应该调用生命周期`componentWillUnmount`函数*

```mermaid
graph LR
start(开始) --> nullOrNot{是否为空节点?} --> |是|null(存在空节点)
nullOrNot --> |否|noNull(都不是空节点)
null--> oldNull(老节点空值) --> addNew(添加新节点) --> returnNew
null--> newNull(新节点空值) --> deleteOld(删除老节点) --> returnNew
null--> allNull(均是空值) --> returnNew
noNull --> diffType(类型不一致) --> deleteOld_addNew(删除老节点,添加新节点) --> returnNew
noNull --> sameType(类型一致)
sameType --> updateDOM(根据新的VDOM更新老的真实DOM) --> returnNew

returnNew(返回新节点) --> end1(结束)
```

### 根据新节点更新老节点

*注意一：调用组件的更新组件方法时，应该调用生命周期`componentWillReceiveProps`函数*

```mermaid
graph LR
start(开始) --> sameType(新老节点类型一直)
sameType --> normalType(普通节点) --> updateNormal(先更新孩子,再更新属性) --> allText(新老节点都是文本节点,直接替换)
updateNormal --> others(依次DOM-Diff新老节点)
sameType --> componentType(组件节点) --> emitUpdate(调用组件的更新组件方法)
```

### 更新孩子

```mermaid
graph LR
start(开始) --> updateChildren(更新孩子) 
updateChildren --> allText(新老节点都是文本节点,直接替换)
updateChildren --> others(依次DOM-Diff新老节点) --> more(TODO...)
```

