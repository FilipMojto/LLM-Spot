import { fetchAndPopulateServices } from "./chat_editor/control_panel/service-loader";
import { fetchAndPopulateModels } from "./chat_editor/control_panel/model-loader";

import { fetchConversations, createChat } from "./server";
import { fillChats, fillMessages, setupEventListener } from "./chat_editor/chat_list_panel/chat-history";
//listeners
import { addContentContainerClickEvents } from "./listeners";
import { addChatListTogglerEvent } from "./chat_editor/listeners";
import { addChatListPanelEvent } from "./chat_editor/listeners";
// bindings
import { bindTemperatureInputToSlider } from "./chat_editor/control_panel/temperature-slider";

import { Conversation } from "./types";
import { DEF_CHAT_NAME } from "./constants";

document.addEventListener("DOMContentLoaded", async () => {
  // seeding values
  await fetchAndPopulateServices();
  const serviceWidget = document.getElementById(
    "service-select-widget"
  ) as HTMLSelectElement;

  await fetchAndPopulateModels(
    serviceWidget.options[serviceWidget.selectedIndex].value
  );

  // adding event listeners

  await addChatListPanelEvent();
  await addContentContainerClickEvents().then(await addChatListTogglerEvent);

  await bindTemperatureInputToSlider();
  // await addChatListTogglerEvent();


  try {
    let chats = await fetchConversations();

    if (!chats || chats.length === 0) {
      chats = [await createChat(DEF_CHAT_NAME) as Conversation]
    }

    await fillChats(chats, true);
    await fillMessages(chats, 0);
    await setupEventListener(DEF_CHAT_NAME);
  
    // return conversations;
    } catch (error) {
    console.error("Error initializing conversations:", error);
    return [];
    }
});
