import React from "react";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { EditorWapCmps } from "../EditorWapCmps";
import { EditTxt } from "../EditTxt";

export function WapTxt({
  cmp,
  onCmpFocus,
  onUpdateCurrCmp,
  onDeleteCmp,
  onCloneCmp,
  updateWap,
  wap,
  isEdit
}) {


  const onUpdateCmp = (cmpTxt) => {
    cmp.info.txt = cmpTxt
    onUpdateCurrCmp(cmp)

  }
  if (!isEdit) {
    return (
      <div className="wap-el publish">
        <EditTxt
          element="span"
          cmp={cmp}
          isEdit={isEdit}
        />
        {cmp.cmps && (
          <EditorWapCmps
            cmp={cmp}
            wap={wap}
            isEdit={isEdit}
          />
        )}

      </div>
    );
  }

  return (
    <div className="wap-el">
      <EditTxt
        element="span"
        cmp={cmp}
        onUpdateWap={() => { updateWap(wap) }}
        onUpdateCurrCmp={onUpdateCmp}
        onCmpFocus={onCmpFocus}
        isEdit={isEdit}
      />
      {cmp.cmps && (
        <EditorWapCmps
          cmp={cmp}
          wap={wap}
          updateWap={updateWap}
          onCmpFocus={onCmpFocus}
          onCloneCmp={onCloneCmp}
          onUpdateCurrCmp={onUpdateCurrCmp}
          onDeleteCmp={onDeleteCmp}
          isEdit={isEdit}
        />
      )}
      <div className="wap-el-tool">
          <button className="wap-el-btn-del"  onClick={() => onCloneCmp(cmp, wap)}>
            <FileCopyOutlinedIcon />
          </button>
          
          <button className="wap-el-btn-del" onClick={() => onDeleteCmp(cmp.id)}><DeleteForeverOutlinedIcon /></button>
      </div>
    </div>
  );
}
