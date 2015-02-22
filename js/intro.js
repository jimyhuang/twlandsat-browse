jQuery(document).ready(function($){
  var intro = introJs();
  intro.setOptions({
    nextLabel: " → ",
    prevLabel: " ← ",
    skipLabel: " ",
    doneLabel: "開始吧！",
    steps: [
      { 
        intro: "歡迎來到賽豬公上太空計畫！"
      },
      {
        element: '#nav',
        intro: "因為 Landsat 衛星每 16 天會經過台灣 4 個地方，你可以從這裡選擇要看哪個位置的地圖。"
      },
      {
        element: '#select-before',
        intro: "選完日期後，已經有地圖的日期，便會顯示在這裡。將左右的日期選擇不同日期，即可看到比較圖"
      },
      {
        element: '.ui-draggable-handle',
        intro: "可以隨時用這個指標將要顯示的區域拉動左右側，以觀察兩個時間點的不同"
      }
    ]
  });

  intro.start();
});
