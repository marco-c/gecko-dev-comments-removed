



import { createThread } from "../client/firefox/create";
import { getSourcesToRemoveForThread } from "../selectors/index";
import { clearDocumentsForSources } from "../utils/editor/source-documents";
import { features } from "../utils/prefs";
import { getEditor } from "../utils/editor/index";

export function addTarget(targetFront) {
  return { type: "INSERT_THREAD", newThread: createThread(targetFront) };
}

export function removeTarget(targetFront) {
  return ({ getState, dispatch, parserWorker }) => {
    const threadActorID = targetFront.targetForm.threadActor;

    
    
    
    
    
    
    const { actors, sources } = getSourcesToRemoveForThread(
      getState(),
      threadActorID
    );

    
    
    clearDocumentsForSources(sources);

    
    
    
    
    
    
    
    dispatch({
      type: "REMOVE_THREAD",
      threadActorID,
      actors,
      sources,
    });
    const sourceIds = sources.map(source => source.id);
    parserWorker.clearSources(sourceIds);
    if (features.codemirrorNext) {
      const editor = getEditor(features.codemirrorNext);
      editor.clearSources(sourceIds);
    }
  };
}

export function toggleJavaScriptEnabled(enabled) {
  return async ({ dispatch, client }) => {
    await client.toggleJavaScriptEnabled(enabled);
    dispatch({
      type: "TOGGLE_JAVASCRIPT_ENABLED",
      value: enabled,
    });
  };
}
