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
      element: '#nav',
      intro: "Landsat衛星每16天會經過台灣5個地方，因此你可以從這裡選擇要看哪個位置的地圖。"
    },
    {
      element: '#select-area',
      intro: "選完區域後，已有地圖資料的日期，便會顯示在這裡。將左右兩個日期設定在不同日期，即可看到比較圖"
    },
    {
      element: '.leaflet-control-layers',
      intro: "可以隨時切換街道圖、或是經過特殊處理的反色圖，以區辨乾、溼、植物覆蓋地景"
    },
    {
      element: '.handle-icon',
      position: 'right',
      intro: "你也可以隨時用這個指標將要顯示的區域拉動左右側，以觀察兩個時間點的不同區域範圍"
    },
    {
      element: '.leaflet-bar-part',
      position: 'right',
      intro: "或開啟標示地圖的功能，可以標示你感興趣的關注地點！"
    }
  ]
});
