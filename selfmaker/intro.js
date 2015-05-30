var intro = introJs();
intro.setOptions({
  nextLabel: "下一步 &rarr; ",
  prevLabel: "上一步 &larr; ",
  exitOnEsc: false,
  exitOnOverlayClick: false,
  skipLabel: " 略過介紹 ",
  doneLabel: "開始吧！",
  steps: [
    {
      intro: "這個介面可以讓你挑選衛星圖，快速製作多時間的演變動畫。"
    },
    {
      element: '#select-area',
      intro: "這裡可以選擇區域"
    },
    {
      element: '#select-before',
      intro: "選完區域後，已有地圖資料的日期，便會顯示在這裡。將左右兩個日期設定在不同日期，即可看到比較圖"
    },
    {
      element: '#nav .btn-info',
      intro: "每當有挑選好的地點，就點這個按鈕，可以把他加入動畫"
    },
    {
      element: '#animation-input',
      intro: "隨時都可以將你這次的動畫命名"
    },
    {
      element: '.handle-icon',
      position: 'right',
      intro: "可以用這個指標將要顯示的區域拉動左右側，以觀察兩個時間點的不同區域範圍"
    }
  ]
});
