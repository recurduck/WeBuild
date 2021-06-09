import { DynamicEditCmp } from "./DynamicEditCmp"
import { EditBackgroundImg } from "./EditorControler/EditBackgroundImg"
import { EditVideo } from "./EditorControler/EditVideo"
import { EditVideoSearch } from "./EditorControler/EditVideoSearch"
import { EditMapLocation } from "./EditorControler/EditMapLocation"
export function EditCmpStyleList({ style, currCmp, onUpdateCurrCmp }) {
    return (
        <div>
            {currCmp.type === "wap-img" && <EditBackgroundImg onUpdateCurrCmp={onUpdateCurrCmp} currCmp={currCmp} />}
            {currCmp.type === "wap-video" && <> <EditVideo onUpdateCurrCmp={onUpdateCurrCmp} currCmp={currCmp} /> <EditVideoSearch onUpdateCurrCmp={onUpdateCurrCmp} currCmp={currCmp}/> </>}
            {currCmp.type === "wap-map" && <EditMapLocation onUpdateCurrCmp={onUpdateCurrCmp} currCmp={currCmp} />}
            {Object.entries(style).map((attribute, idx) => <DynamicEditCmp key={idx}
                attribute={attribute[0]}
                value={attribute[1]}
                currCmp={currCmp}
                onUpdateCurrCmp={onUpdateCurrCmp}
            />)}
        </div>
    )
}