export const showLive2dGirls = () => {
  const live2dDom = document.querySelector('#waifu');

  if (live2dDom) {
    live2dDom.style.visibility = 'visible';
  }
};

export const hideLive2dGirls = () => {
  const live2dDom = document.querySelector('#waifu');

  if (live2dDom) {
    live2dDom.style.visibility = 'hidden';
  }
};

/**
 * [更新回答框内容]
 * @param _answer
 */
export const updateLive2dChatAnswer = (_answer: string) => {
  const answerBox: HTMLElement | null = document.querySelector('#waifu-tips');

  if (answerBox) {
    if (answerBox) {
      answerBox.innerText = _answer;
    }
  }
};
