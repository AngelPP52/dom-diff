/**
 * DOM-Diff入口
 * 
 * @param {*} parentDOM 根节点（真实DOM）
 * @param {*} oldVDOM 旧节点
 * @param {*} newVDOM 新节点
 */
function compareTowVDOM(parentDOM, oldVDOM, newVDOM) {
    if (oldVDOM === null || newVDOM === null) { // 存在空节点
        if (oldVDOM === null && newVDOM !== null) { // 老节点是空节点
            let dom = createDOM(newVDOM);
            parentDOM.appendChild(dom);
            newVDOM.dom = dom;
        } else if (oldVDOM !== null && newVDOM === null) { // 新节点是空节点
            parentDOM.removeChild(oldVDOM.dom);
            let classInstance = oldVDOM.dom.classInstance;
            if (classInstance && classInstance.componentWillUnmount) {
                classInstance.componentWillUnmount();
            }
        } else if (oldVDOM === null && newVDOM === null) { // 均是空节点
            // 啥都不做
        }
    } else { // 都不是空节点
        if (oldVDOM.type !== newVDOM.type){ // 类型不一致
            // 删除老节点
            parentDOM.removeChild(oldVDOM.dom);
            let classInstance = oldVDOM.dom.classInstance;
            if (classInstance && classInstance.componentWillUnmount) {
                classInstance.componentWillUnmount();
            }
            // 添加新节点
            let dom = createDOM(newVDOM);
            parentDOM.appendChild(dom);
            newVDOM.dom = dom;
        }else{ // 类型一样
            updateElement(oldVDOM, newVDOM);
        }
    }
    return newVDOM;
}


/**
 * 新老节点类型一样，根据新的VDOM更新老的真实DOM
 * 
 * @param {*} parentDOM 根节点（真实DOM）
 * @param {*} oldVDOM 旧节点
 * @param {*} newVDOM 新节点
 */
function updateElement(oldVDOM, newVDOM) {
    newVDOM.dom = oldVDOM.dom;
    if(oldVDOM.type === 'string'){ // 普通节点
        let {children, props} = oldVDOM;
        updateChildren();
        updateProps();
    }else if(typeof oldVDOM.type === 'function'){ // 组件节点
        let classInstance = oldVDOM.dom.classInstance;
        if(classInstance){
            if(classInstance.componentWillReceiveProps){
                classInstance.componentWillReceiveProps()
            }
            classInstance.$updater.emitUpdate(newVDOM.props);
        }
    }
}