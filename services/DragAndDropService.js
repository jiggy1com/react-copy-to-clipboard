const HOVER_HIGHLIGHT_CLASS = 'active';

export class DragAndDropService {


    constructor(obj = {}) {

        // valid css selectors
        this.dragSelectors = document.querySelectorAll(obj.dragSelectors);
        this.dropSelectors = document.querySelectorAll(obj.dropSelectors);

        // handlers
        this.onDragHandler = obj.onDrag
        this.onDragEndHandler = obj.onDragEnd;
        this.onDragEnterHandler = obj.onDragEnter;
        this.onDragLeaveHandler = obj.onDragLeave;
        this.onDragOverHandler = obj.onDragOver;
        this.onDragStartHandler = obj.onDragStart;
        this.onDropHandler = obj.onDrop;

        // dispatcher
        this.onDispatchHandler = obj.onDispatchHandler ?? function () {
        };

        // drag element
        this.elementBeingDragged = null;

        // initialize
        this.init()

    }

    init() {
        if (typeof window === 'undefined') {
            return
        }
        if (!this.dispatcher) {
            DragAndDropService.prototype.dispatcher = document.createElement('div')
        }
        this.setupDrag();
    }

    setupDrag() {
        this.dragSelectors.forEach((el) => {

            el.classList.add('draggable')
            el.setAttribute('draggable', true)

            el.ondrag = (e) => {
                this.onDrag(e)
            };

            el.ondragend = (e) => {
                this.onDragEnd(e)
            };

            el.ondragstart = (e) => {
                this.onDragStart(e)
            };

            el.ondragenter = (e) => {
                this.onDragEnter(e)
            };

            el.ondragleave = (e) => {
                this.onDragLeave(e)
            };

        })
        this.dropSelectors.forEach((el) => {

            el.classList.add('droppable');
            el.setAttribute('droppable', true)

            el.ondragover = (e) => {
                this.onDragOver(e)
            };

            el.ondrop = (e) => {
                this.onDrop(e)
            };
        })
    }


    // dispatcher
    dispatch(eventType = null) {
        if (eventType) {
            let event = new CustomEvent(eventType);
            this.dispatcher.dispatchEvent(event);
        }
        this.onDispatch()
    }

    /**
     * Usage:
     * let service = new DragAndDropService()
     * service.onDispatch(callback)
     * @param handler
     */
    onDispatch(handler) {
        if (handler) {
            this.onDispatchHandler = handler;
        } else {
            if (typeof this.onDispatchHandler === 'function') {
                this.onDispatchHandler()
            }
        }
    }

    // dry
    doCommonTask(task) {
        this.dispatch('task')
    }

    // helpers
    getSiblings(element) {
        if(!element.parentNode){
            return []
        }
        let siblings = element.parentNode.childNodes;
        return siblings;
    }

    isSibling(element) {
        let siblingsList = this.getSiblings(element);
        let found = false;
        siblingsList.forEach((sibling)=>{
            if(!found){
                found = sibling === this.elementBeingDragged
            }
        })
        return found;
    }

    getClosestDraggable(element){
        let ret;
        if(element){
            if(element.classList.contains('draggable')){
                ret = element
            }else{
                ret = element.closest('.draggable')
            }
            return ret;
        }
        return null
    }

    getClosestDroppable(element){
        let ret;
        if(element){
            if(element.classList.contains('droppable')){
                console.log('should be returning droppable 1')
                ret = element
            }else{
                console.log('should be returning droppable 2')
                ret = element.closest('.droppable')
            }
            return ret;
        }
        return null
    }

    isDragElementInDragSelectors(){
        return
    }

    isDroppable(canDropHere, elementBeingDragged){
        // console.log('isDroppable: check here', canDropHere, 'dragging:', elementBeingDragged, 'service-dragging:', this.elementBeingDragged)
        let found = false;
        this.dropSelectors.forEach((el)=>{
            if(!found){
                found = el === canDropHere
            }
        })
        return found
    }

    getElementBeingDragged(el){
        if(el.classList.contains('draggable')){
            return el
        }
        return el.closest('.draggable')
    }

    // drag events

    onDrag(e) {
        // console.log('onDrag', e)
        // LIB

        // UDF
        if (typeof this.onDragHandler === 'function') {
            this.onDragHandler()
        }
    }

    onDragEnd(e) {
        // console.log('onDragEnd', e)

        // UDF
        if (typeof this.onDragEndHandler === 'function') {
            this.onDragEndHandler()
        }
    }

    // fires once
    onDragEnter(e,f) {
        // console.log('onDragEnter', e, this.elementBeingDragged);
        if(this.elementBeingDragged){
            let el = this.getClosestDroppable(e.target);

            e.stopPropagation()

            if(this.isDroppable(el)){
                el.classList.add(HOVER_HIGHLIGHT_CLASS);
            }

            // UDF
            if (typeof this.onDragEnterHandler === 'function') {
                this.onDragEnterHandler({
                    canDrop: this.isDroppable()
                })
            }
        }
    }

    // fires once
    onDragLeave(e) {
        // console.log('onDragLeave', e)
        e.target.closest('.draggable').classList.remove(HOVER_HIGHLIGHT_CLASS);

        // UDF
        if (typeof this.onDragLeaveHandler === 'function') {
            this.onDragLeaveHandler()
        }
    }

    // fires multiple times
    onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        // console.log('onDragOver', e)

        // UDF
        if (typeof this.onDragOverHandler === 'function') {
            this.onDragOverHandler()
        }
    }

    onDragStart(e) {
        this.elementBeingDragged = this.getElementBeingDragged(e.target);
        e.dataTransfer.setData("application/my-app", e.target.id);
        e.dataTransfer.effectAllowed = "move";
        // console.log('onDragStart', e)

        // UDF
        if (typeof this.onDragStartHandler === 'function') {
            this.onDragStartHandler()
        }
    }

    onDrop(e) {
        console.log('DragAndDropService:onDrop', e);
        const data = e.dataTransfer.getData("application/my-app");
        const elementBeingDragged = this.elementBeingDragged;
        // this.elementBeingDragged = null;
        // e.target.appendChild(document.getElementById(data));
        let el = this.getClosestDroppable(e.target);
        if(this.isDroppable(el)){
            console.log('isDroppable', el)

            let obj = {
                dragElement: elementBeingDragged,
                dropElement: el,
            }

            // UDF
            if (typeof this.onDropHandler === 'function') {
                console.log('calling drop handler', obj, this.onDropHandler, this)
                this.onDropHandler(obj)
            }
        }
    }

}

DragAndDropService.prototype.dispatcher = null;
