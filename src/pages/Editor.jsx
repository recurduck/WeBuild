import { Component } from "react";
import { connect } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";

import { cmpService } from "../services/cmp.service.js";
import { wapService } from "../services/wap.service.js";
import { socketService } from "../services/socket.service.js";
import { utilService } from "../services/utils.js";
import EditIcon from '@material-ui/icons/Edit';

import {
  loadWaps,
  loadCmps,
  setWapToEdit,
} from "../store/actions/wap.actions.js";
import { setMsg } from "../store/actions/user.msg.actions.js";

import { EditorSideBar } from "../cmps/EditorCmps/EditorSideBar";
import { EditorWapSections } from "../cmps/EditorCmps/EditorWapSections";
import { UserMsg } from "../cmps/UserMsg.jsx";
import { Loader } from "../cmps/Loader.jsx";
import React from "react";
import {Modal} from "../cmps/Modal"
export class _Editor extends Component {
  state = {
    editorStatus: "add",
    currWap: null,
    currCmp: null,
    undoWaps: [],
    respView: "large-view",
    isLodaing: false,
    isShown:false
  };

  async componentDidMount() {
    if (!this.props.waps) await this.props.loadWaps();
    if (!this.props.cmps) await this.props.loadCmps();
    await this.setCurrWap();
    let screenView =
      window.innerWidth <= 555
        ? "small-view"
        : window.innerWidth <= 815
          ? "medium-view"
          : "large-view";
    let status = window.innerWidth <= 555 ? "edit" : "add";
    await socketService.setup();
    socketService.emit(
      "editor id",
      this.state.currWap.sessionId || this.props.match.params.roomId
    );
    socketService.on("update wap", this.updateSocketWap);
    socketService.on("mouse_position_update", this.onUpdateMousePos)
    // socket.broadcast.emit('mouse_position_update', data);
    this.setState({ respView: screenView, editorStatus: status });
  }

  mouseRef = React.createRef()



  componentWillUnmount() {
    this.props.setWapToEdit(null);
    socketService.off("update wap", this.updateSocketWap);
    socketService.off("mouse_position_update", this.onUpdateMousePos)
    socketService.terminate();
  }

  setCurrWap = async () => {
    let currWap;
    if (!this.props.wapToEdit) currWap = await wapService.create();
    else {
      currWap = { ...this.props.wapToEdit };
      delete currWap._id;
    }
    currWap.isEdit = true;
    currWap.coordinates = {
      x: null,
      y: null
    }
    if (!currWap.sessionId && !this.props.match.params.roomId) {
      currWap.sessionId = utilService.makeId();
      this.props.history.push(`/editor/${currWap.sessionId}`);
    }
    const { undoWaps } = this.state;
    undoWaps.push(JSON.parse(JSON.stringify(currWap)));
    const userUrl = window.location.href
    this.setState({ ...this.state, currWap, undoWaps, userUrl }, () => {
      socketService.emit('update wap', { currWap: this.state.currWap, undoWaps: this.state.undoWaps })
    });
  };

  updateSocketWap = (data) => {
    this.setState((prevState) => ({
      ...prevState,
      currWap: data.currWap,
      undoWaps: data.undoWaps
    }));
  };

  onCmpFocus = (ev, currCmp) => {
    ev.stopPropagation();
    this.setState(
      (prevState) => ({
        ...prevState,
        currCmp,
      }),
      this.onEdit
    );
  };

  onDeleteCmp = async (cmpId) => {
    const undoWaps = await this.addUndoWap();
    const currWap = await wapService.deleteTarget(this.state.currWap, cmpId);

    this.setState((prevState) => ({
      ...prevState,
      currWap,
      undoWaps,
      currCmp: null,
    }), () => {
      socketService.emit('update wap', { currWap: this.state.currWap, undoWaps: this.state.undoWaps })
    });
  };

  onUpdateCurrCmp = async (currCmp) => {
    const undoWaps = await this.addUndoWap();
    const copyCmp = { ...currCmp };
    delete copyCmp.id;
    const copyWap = { ...this.state.currWap };
    const currWap = await wapService.updateTarget(copyWap, currCmp.id, copyCmp);
    this.setState((prevState) => ({
      ...prevState,
      currCmp,
      currWap,
      undoWaps,
    }), () => {
      socketService.emit('update wap', { currWap: this.state.currWap, undoWaps: this.state.undoWaps })
    });
  };

  onCloneCmp = async (cmp, currWap) => {
    console.log("cmp:", cmp, "cmp.parentId", cmp.parentId);
    const undoWaps = await this.addUndoWap();
    const clonedCmp = await cmpService.changeIds(cmp);
    if (cmp.parentId === "main") {
      currWap.cmps.splice(cmp.idx, 0, clonedCmp);
    } else {
      const parent = await wapService.getTarget(currWap, cmp.parentId);
      console.log(parent);
      parent.cmps.splice(cmp.idx, 0, clonedCmp);
    }
    this.setState((prevState) => ({
      ...prevState,
      currWap,
      undoWaps,
    }), () => {
      socketService.emit('update wap', { currWap: this.state.currWap, undoWaps: this.state.undoWaps })
    });
  };

  onEdit = () => {
    this.setState({ editorStatus: "edit" });
  };
  onAdd = () => {
    this.setState({ editorStatus: "add" });
  };

  onAddCmp = async (cmpId, idx) => {
    const undoWaps = await this.addUndoWap();
    const { currWap } = this.state;
    const wapToSave = { ...currWap };
    cmpId = cmpId.substring(1);
    const cmpToUpdate = await this.props.cmps.find((cmp) => cmp.id === cmpId);
    const cmp = { ...cmpToUpdate };
    const updatedCmp = await cmpService.changeIds(cmp);
    let wap = await wapService.addCmp(wapToSave, updatedCmp, idx);
    wap = JSON.parse(JSON.stringify(wap));
    socketService.emit("change wap", wap);
    this.setState((prevState) => ({
      ...prevState,
      currWap: wap,
      undoWaps,
    }), () => {
      socketService.emit('update wap', { currWap: this.state.currWap, undoWaps: this.state.undoWaps })
    });
  };

  onUndoWap = () => {
    if (this.state.undoWaps.length < 2) return;
    const undoWaps = JSON.parse(JSON.stringify(this.state.undoWaps));
    const currWap = JSON.parse(JSON.stringify(undoWaps.pop()));
    this.setState((prevState) => ({
      ...prevState,
      currWap,
      undoWaps,
    }), () => {
      socketService.emit('update wap', { currWap: this.state.currWap, undoWaps: this.state.undoWaps })
    });
  };

  addUndoWap = () => {
    const wap = JSON.parse(JSON.stringify(this.state.currWap));
    const undoWaps = JSON.parse(JSON.stringify(this.state.undoWaps));
    undoWaps.push(wap);
    return Promise.resolve(undoWaps);
  };

  onSaveWap = async () => {
    try {
      const newWap = { ...this.state.currWap };
      const savedWap = await wapService.save(newWap);
      await this.props.loadWaps();
      return Promise.resolve(savedWap[0]);
    } catch (err) {
      console.log(err);
      this.props.setMsg(
        "There was a problam. please try again later!",
        "error"
      );
      setTimeout(() => {
        this.props.setMsg("", "error");
      }, 3000);
      throw new Error(err);
    }
  };

  onPublishWap = async () => {
    if (!this.state.currWap.cmps.length) {
      this.props.setMsg("You can't publish empty Website", "error");
      await setTimeout(() => {
        this.props.setMsg("", "error");
      }, 3000);
      return;
    }
    this.setState({ isLodaing: true });
    const newWap = await this.onSaveWap();
    this.setState({ isLodaing: false });
    this.props.history.push(`/publish/${newWap._id}`);
  };

  onDragEnd = async (res) => {
    const { destination, source, draggableId } = res;
    if (!destination) {
      return;
    }
    if (
      destination.draggableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (source.droppableId === "1" && destination.droppableId === "2") return;

    if (source.droppableId === "1" && destination.droppableId === "1") {
      const wapCmps = this.state.currWap;
      const tempCmp = wapCmps.cmps[source.index];
      wapCmps.cmps.splice(source.index, 1, wapCmps.cmps[destination.index]);
      wapCmps.cmps.splice(destination.index, 1, tempCmp);
      this.setState((prevState) => ({
        ...prevState,
        currWap: wapCmps,
      }), () => {
        socketService.emit('update wap', { currWap: this.state.currWap, undoWaps: this.state.undoWaps })
      });
      return;
    }
    if (source.droppableId === "2" && destination.droppableId === "1") {
      await this.onAddCmp(draggableId, destination.index);
    }
  };

  handleChange = ({ target }) => {
    const field = target.name;
    const value = target.type === "number" ? +target.value : target.value;
    this.setState((prevState) =>
      field === "type"
        ? { [field]: value }
        : {
          ...prevState,
          [field]: value,
        }
    );
  };


  onUpdateMousePos = (newPos) => {
    this.mouseRef.current.style.position = 'absolute';
    this.mouseRef.current.style.display = 'block';
    this.mouseRef.current.style.zIndex = 100;
    this.mouseRef.current.style.left = newPos.x + 'px';
    this.mouseRef.current.style.top = newPos.y + 'px';
  }

  onMovingMouse = (ev) => {
    if (window.innerWidth < 555) return
    const pos = { x: ev.clientX, y: ev.clientY }
    socketService.emit('mouse move', pos)
  }
  
  onOutSideClick = (ev) => {
    if (ev.target.classList.contains("modal-container")) {
      this.setState({ isShown: false });

      
    }
  };
  openModal = () => {
    this.setState({ isShown: true });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isModalOpen: !this.state.isModalOpen
    }))
  }

  render() {
    const { editorStatus, currCmp, currWap, respView, undoWaps, isLodaing, userUrl} =
      this.state;
    const { addCmp, changeCmpsIds, updateWap, cmps } = this.props;
    if (!currWap || isLodaing) return <Loader />;
    return (
      <> 
      <section className="app-editor flex space-between" onMouseMove={this.onMovingMouse}>
        <EditIcon ref={this.mouseRef} style={{ display: 'none' }} />
        <UserMsg />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <EditorSideBar
            userUrl={userUrl}
            toggleModal={this.toggleModal}
            onUndoWap={this.onUndoWap}
            undoWaps={undoWaps}
            currCmp={currCmp}
            onUpdateCurrCmp={this.onUpdateCurrCmp}
            editorStatus={editorStatus}
            onEdit={this.onEdit}
            onAdd={this.onAdd}
            addCmp={addCmp}
            currWap={currWap}
            saveWap={this.onSaveWap}
            onPublish={this.onPublishWap}
            changeCmpsIds={changeCmpsIds}
            onDragEnd={this.onDragEnd}
            cmps={cmps}
            isEdit={true}
            handleChange={this.handleChange}
            openModal={this.openModal}
          />
          <div className="editor-wap" >
            <EditorWapSections
              wap={currWap}
              isEdit={true}
              onCmpFocus={this.onCmpFocus}
              currCmp={currCmp}
              onUpdateCurrCmp={this.onUpdateCurrCmp}
              onCloneCmp={this.onCloneCmp}
              onDeleteCmp={this.onDeleteCmp}
              updateWap={updateWap}
              respView={respView}/>
          </div>
         
        </DragDropContext>
        
      
      </section>
      {this.state.isShown && <Modal onOutSideClick={this.onOutSideClick} closeModal={this.closeModal} userUrl={this.state.userUrl}/>}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    waps: state.wapModule.waps,
    cmps: state.wapModule.cmps,
    wapToEdit: state.wapModule.wapToEdit,
  };
}
const mapDispatchToProps = {
  loadWaps,
  loadCmps,
  setMsg,
  setWapToEdit,
};

export const Editor = connect(mapStateToProps, mapDispatchToProps)(_Editor);
