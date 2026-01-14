<template src="./i12_evaluation_dashboard.html"></template>
<script>
import API from "./API";
import KDataGrid from "@/components/controls/KDataGrid";
import DetailModal from "./DetailModal.vue";
import * as XLSX from "xlsx";
import {
  DETAIL_COLUMNS,
  mapTaskData,
  getColumnWidths,
  mapTaskToRowData,
} from "./ColumnConfig";

export default {
  name: "I12EvaluationDashboard",
  components: {
    KDataGrid,
    DetailModal,
  },
  data() {
    return {
      header: {
        title: "Báo cáo số liệu đánh giá tự động chỉ tiêu I12",
        list: [],
      },
      loading: false,
      searching: false,
      searchTimeout: null,
      date_format: "MM/yyyy",

      columns: [
        {
          headerText: "Phòng ban",
          fieldName: "phongBan",
          width: "80",
          cssClass: "clickable-cell",
          headerCssClass: "text-center",
        },
        {
          headerText: "Nhân sự",
          fieldName: "nguoiNhan",
          width: "90",
          cssClass: "clickable-cell",
        },
        {
          headerText: "Chất lượng",
          width: "320",
          headerTemplate: `
          <div style="padding-bottom: 10px">Chất lượng</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="35.442ex" height="4.905ex" role="img" focusable="false" viewBox="0 -1460 15665.4 2168" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" style="vertical-align: -1.602ex;"><defs><path id="MJX-1-TEX-I-1D447" d="M40 437Q21 437 21 445Q21 450 37 501T71 602L88 651Q93 669 101 677H569H659Q691 677 697 676T704 667Q704 661 687 553T668 444Q668 437 649 437Q640 437 637 437T631 442L629 445Q629 451 635 490T641 551Q641 586 628 604T573 629Q568 630 515 631Q469 631 457 630T439 622Q438 621 368 343T298 60Q298 48 386 46Q418 46 427 45T436 36Q436 31 433 22Q429 4 424 1L422 0Q419 0 415 0Q410 0 363 1T228 2Q99 2 64 0H49Q43 6 43 9T45 27Q49 40 55 46H83H94Q174 46 189 55Q190 56 191 56Q196 59 201 76T241 233Q258 301 269 344Q339 619 339 625Q339 630 310 630H279Q212 630 191 624Q146 614 121 583T67 467Q60 445 57 441T43 437H40Z"></path><path id="MJX-1-TEX-I-1D43F" d="M228 637Q194 637 192 641Q191 643 191 649Q191 673 202 682Q204 683 217 683Q271 680 344 680Q485 680 506 683H518Q524 677 524 674T522 656Q517 641 513 637H475Q406 636 394 628Q387 624 380 600T313 336Q297 271 279 198T252 88L243 52Q243 48 252 48T311 46H328Q360 46 379 47T428 54T478 72T522 106T564 161Q580 191 594 228T611 270Q616 273 628 273H641Q647 264 647 262T627 203T583 83T557 9Q555 4 553 3T537 0T494 -1Q483 -1 418 -1T294 0H116Q32 0 32 10Q32 17 34 24Q39 43 44 45Q48 46 59 46H65Q92 46 125 49Q139 52 144 61Q147 65 216 339T285 628Q285 635 228 637Z"></path><path id="MJX-1-TEX-I-1D43B" d="M228 637Q194 637 192 641Q191 643 191 649Q191 673 202 682Q204 683 219 683Q260 681 355 681Q389 681 418 681T463 682T483 682Q499 682 499 672Q499 670 497 658Q492 641 487 638H485Q483 638 480 638T473 638T464 637T455 637Q416 636 405 634T387 623Q384 619 355 500Q348 474 340 442T328 395L324 380Q324 378 469 378H614L615 381Q615 384 646 504Q674 619 674 627T617 637Q594 637 587 639T580 648Q580 650 582 660Q586 677 588 679T604 682Q609 682 646 681T740 680Q802 680 835 681T871 682Q888 682 888 672Q888 645 876 638H874Q872 638 869 638T862 638T853 637T844 637Q805 636 794 634T776 623Q773 618 704 340T634 58Q634 51 638 51Q646 48 692 46H723Q729 38 729 37T726 19Q722 6 716 0H701Q664 2 567 2Q533 2 504 2T458 2T437 1Q420 1 420 10Q420 15 423 24Q428 43 433 45Q437 46 448 46H454Q481 46 514 49Q520 50 522 50T528 55T534 64T540 82T547 110T558 153Q565 181 569 198Q602 330 602 331T457 332H312L279 197Q245 63 245 58Q245 51 253 49T303 46H334Q340 38 340 37T337 19Q333 6 327 0H312Q275 2 178 2Q144 2 115 2T69 2T48 1Q31 1 31 10Q31 12 34 24Q39 43 44 45Q48 46 59 46H65Q92 46 125 49Q139 52 144 61Q147 65 216 339T285 628Q285 635 228 637Z"></path><path id="MJX-1-TEX-N-3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path><path id="MJX-1-TEX-N-2212" d="M84 237T84 250T98 270H679Q694 262 694 250T679 230H98Q84 237 84 250Z"></path><path id="MJX-1-TEX-N-28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path><path id="MJX-1-TEX-I-1D458" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z"></path><path id="MJX-1-TEX-N-31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path id="MJX-1-TEX-N-2217" d="M229 286Q216 420 216 436Q216 454 240 464Q241 464 245 464T251 465Q263 464 273 456T283 436Q283 419 277 356T270 286L328 328Q384 369 389 372T399 375Q412 375 423 365T435 338Q435 325 425 315Q420 312 357 282T289 250L355 219L425 184Q434 175 434 161Q434 146 425 136T401 125Q393 125 383 131T328 171L270 213Q283 79 283 63Q283 53 276 44T250 35Q231 35 224 44T216 63Q216 80 222 143T229 213L171 171Q115 130 110 127Q106 124 100 124Q87 124 76 134T64 161Q64 166 64 169T67 175T72 181T81 188T94 195T113 204T138 215T170 230T210 250L74 315Q65 324 65 338Q65 353 74 363T98 374Q106 374 116 368T171 328L229 286Z"></path><path id="MJX-1-TEX-N-2B" d="M56 237T56 250T70 270H369V420L370 570Q380 583 389 583Q402 583 409 568V270H707Q722 262 722 250T707 230H409V-68Q401 -82 391 -82H389H387Q375 -82 369 -68V230H70Q56 237 56 250Z"></path><path id="MJX-1-TEX-N-32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path><path id="MJX-1-TEX-N-29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path><path id="MJX-1-TEX-I-1D43A" d="M50 252Q50 367 117 473T286 641T490 704Q580 704 633 653Q642 643 648 636T656 626L657 623Q660 623 684 649Q691 655 699 663T715 679T725 690L740 705H746Q760 705 760 698Q760 694 728 561Q692 422 692 421Q690 416 687 415T669 413H653Q647 419 647 422Q647 423 648 429T650 449T651 481Q651 552 619 605T510 659Q492 659 471 656T418 643T357 615T294 567T236 496T189 394T158 260Q156 242 156 221Q156 173 170 136T206 79T256 45T308 28T353 24Q407 24 452 47T514 106Q517 114 529 161T541 214Q541 222 528 224T468 227H431Q425 233 425 235T427 254Q431 267 437 273H454Q494 271 594 271Q634 271 659 271T695 272T707 272Q721 272 721 263Q721 261 719 249Q714 230 709 228Q706 227 694 227Q674 227 653 224Q646 221 643 215T629 164Q620 131 614 108Q589 6 586 3Q584 1 581 1Q571 1 553 21T530 52Q530 53 528 52T522 47Q448 -22 322 -22Q201 -22 126 55T50 252Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><use data-c="1D447" xlink:href="#MJX-1-TEX-I-1D447"></use></g><g data-mml-node="mi" transform="translate(704,0)"><use data-c="1D43F" xlink:href="#MJX-1-TEX-I-1D43F"></use></g><g data-mml-node="mi" transform="translate(1385,0)"><use data-c="1D447" xlink:href="#MJX-1-TEX-I-1D447"></use></g><g data-mml-node="mi" transform="translate(2089,0)"><use data-c="1D43B" xlink:href="#MJX-1-TEX-I-1D43B"></use></g><g data-mml-node="mo" transform="translate(3254.8,0)"><use data-c="3D" xlink:href="#MJX-1-TEX-N-3D"></use></g><g data-mml-node="mfrac" transform="translate(4310.6,0)"><g data-mml-node="mrow" transform="translate(220,710)"><g data-mml-node="mi"><use data-c="1D43B" xlink:href="#MJX-1-TEX-I-1D43B"></use></g><g data-mml-node="mi" transform="translate(888,0)"><use data-c="1D447" xlink:href="#MJX-1-TEX-I-1D447"></use></g><g data-mml-node="mo" transform="translate(1814.2,0)"><use data-c="2212" xlink:href="#MJX-1-TEX-N-2212"></use></g><g data-mml-node="mo" transform="translate(2814.4,0)"><use data-c="28" xlink:href="#MJX-1-TEX-N-28"></use></g><g data-mml-node="msub" transform="translate(3203.4,0)"><g data-mml-node="mi"><use data-c="1D458" xlink:href="#MJX-1-TEX-I-1D458"></use></g><g data-mml-node="mn" transform="translate(554,-150) scale(0.707)"><use data-c="31" xlink:href="#MJX-1-TEX-N-31"></use></g></g><g data-mml-node="mo" transform="translate(4383.2,0)"><use data-c="2217" xlink:href="#MJX-1-TEX-N-2217"></use></g><g data-mml-node="mi" transform="translate(5105.4,0)"><use data-c="1D447" xlink:href="#MJX-1-TEX-I-1D447"></use></g><g data-mml-node="mi" transform="translate(5809.4,0)"><use data-c="1D43B" xlink:href="#MJX-1-TEX-I-1D43B"></use></g><g data-mml-node="mo" transform="translate(6919.7,0)"><use data-c="2B" xlink:href="#MJX-1-TEX-N-2B"></use></g><g data-mml-node="msub" transform="translate(7919.9,0)"><g data-mml-node="mi"><use data-c="1D458" xlink:href="#MJX-1-TEX-I-1D458"></use></g><g data-mml-node="mn" transform="translate(554,-150) scale(0.707)"><use data-c="32" xlink:href="#MJX-1-TEX-N-32"></use></g></g><g data-mml-node="mo" transform="translate(9099.7,0)"><use data-c="2217" xlink:href="#MJX-1-TEX-N-2217"></use></g><g data-mml-node="mi" transform="translate(9821.9,0)"><use data-c="1D447" xlink:href="#MJX-1-TEX-I-1D447"></use></g><g data-mml-node="mo" transform="translate(10525.9,0)"><use data-c="29" xlink:href="#MJX-1-TEX-N-29"></use></g></g><g data-mml-node="mi" transform="translate(5284.4,-686)"><use data-c="1D43A" xlink:href="#MJX-1-TEX-I-1D43A"></use></g><rect width="11114.9" height="60" x="120" y="220"></rect></g></g></g></svg>
        `,
          columns: [
            {
              headerText: "HT",
              fieldName: "tong_TASK",
              width: "60",
              cssClass: "clickable-cell",
              headerCssClass: "text-center",
            },
            {
              headerText: "TH",
              fieldName: "tong_TGTT_DungHan",
              width: "60",
              cssClass: "clickable-cell",
              headerCssClass: "text-center",
            },
            {
              headerText: "T",
              fieldName: "tong_TGTT_QUAHAN",
              width: "60",
              cssClass: "clickable-cell",
              headerCssClass: "text-center",
            },
            {
              headerText: "G",
              fieldName: "tong_TASK",
              isGroupedColumn: true,
              width: "60",
              cssClass: "clickable-cell",
              headerCssClass: "text-center",
            },
            {
              headerText: "TLTH",
              fieldName: "sub_content_1",
              width: "60",
              cssClass: "clickable-cell",
              headerCssClass: "text-center",
            },
            {
              headerText: "Điểm",
              fieldName: "sub_content_2",
              width: "60",
              headerCssClass: "text-center",
            },
          ],
        },
        {
          headerText: "Tiến độ",
          fieldName: "content",
          width: "300",
          headerTemplate: `
                    <div style="padding-bottom: 10px">Tiến độ</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24.709ex" height="5.542ex" role="img" focusable="false" viewBox="0 -1763.3 10921.5 2449.3" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" style="vertical-align: -1.552ex;"><defs><path id="MJX-1-TEX-I-1D447" d="M40 437Q21 437 21 445Q21 450 37 501T71 602L88 651Q93 669 101 677H569H659Q691 677 697 676T704 667Q704 661 687 553T668 444Q668 437 649 437Q640 437 637 437T631 442L629 445Q629 451 635 490T641 551Q641 586 628 604T573 629Q568 630 515 631Q469 631 457 630T439 622Q438 621 368 343T298 60Q298 48 386 46Q418 46 427 45T436 36Q436 31 433 22Q429 4 424 1L422 0Q419 0 415 0Q410 0 363 1T228 2Q99 2 64 0H49Q43 6 43 9T45 27Q49 40 55 46H83H94Q174 46 189 55Q190 56 191 56Q196 59 201 76T241 233Q258 301 269 344Q339 619 339 625Q339 630 310 630H279Q212 630 191 624Q146 614 121 583T67 467Q60 445 57 441T43 437H40Z"></path><path id="MJX-1-TEX-I-1D43F" d="M228 637Q194 637 192 641Q191 643 191 649Q191 673 202 682Q204 683 217 683Q271 680 344 680Q485 680 506 683H518Q524 677 524 674T522 656Q517 641 513 637H475Q406 636 394 628Q387 624 380 600T313 336Q297 271 279 198T252 88L243 52Q243 48 252 48T311 46H328Q360 46 379 47T428 54T478 72T522 106T564 161Q580 191 594 228T611 270Q616 273 628 273H641Q647 264 647 262T627 203T583 83T557 9Q555 4 553 3T537 0T494 -1Q483 -1 418 -1T294 0H116Q32 0 32 10Q32 17 34 24Q39 43 44 45Q48 46 59 46H65Q92 46 125 49Q139 52 144 61Q147 65 216 339T285 628Q285 635 228 637Z"></path><path id="MJX-1-TEX-I-1D43B" d="M228 637Q194 637 192 641Q191 643 191 649Q191 673 202 682Q204 683 219 683Q260 681 355 681Q389 681 418 681T463 682T483 682Q499 682 499 672Q499 670 497 658Q492 641 487 638H485Q483 638 480 638T473 638T464 637T455 637Q416 636 405 634T387 623Q384 619 355 500Q348 474 340 442T328 395L324 380Q324 378 469 378H614L615 381Q615 384 646 504Q674 619 674 627T617 637Q594 637 587 639T580 648Q580 650 582 660Q586 677 588 679T604 682Q609 682 646 681T740 680Q802 680 835 681T871 682Q888 682 888 672Q888 645 876 638H874Q872 638 869 638T862 638T853 637T844 637Q805 636 794 634T776 623Q773 618 704 340T634 58Q634 51 638 51Q646 48 692 46H723Q729 38 729 37T726 19Q722 6 716 0H701Q664 2 567 2Q533 2 504 2T458 2T437 1Q420 1 420 10Q420 15 423 24Q428 43 433 45Q437 46 448 46H454Q481 46 514 49Q520 50 522 50T528 55T534 64T540 82T547 110T558 153Q565 181 569 198Q602 330 602 331T457 332H312L279 197Q245 63 245 58Q245 51 253 49T303 46H334Q340 38 340 37T337 19Q333 6 327 0H312Q275 2 178 2Q144 2 115 2T69 2T48 1Q31 1 31 10Q31 12 34 24Q39 43 44 45Q48 46 59 46H65Q92 46 125 49Q139 52 144 61Q147 65 216 339T285 628Q285 635 228 637Z"></path><path id="MJX-1-TEX-N-3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path><path id="MJX-1-TEX-SO-2211" d="M61 748Q64 750 489 750H913L954 640Q965 609 976 579T993 533T999 516H979L959 517Q936 579 886 621T777 682Q724 700 655 705T436 710H319Q183 710 183 709Q186 706 348 484T511 259Q517 250 513 244L490 216Q466 188 420 134T330 27L149 -187Q149 -188 362 -188Q388 -188 436 -188T506 -189Q679 -189 778 -162T936 -43Q946 -27 959 6H999L913 -249L489 -250Q65 -250 62 -248Q56 -246 56 -239Q56 -234 118 -161Q186 -81 245 -11L428 206Q428 207 242 462L57 717L56 728Q56 744 61 748Z"></path><path id="MJX-1-TEX-I-1D441" d="M234 637Q231 637 226 637Q201 637 196 638T191 649Q191 676 202 682Q204 683 299 683Q376 683 387 683T401 677Q612 181 616 168L670 381Q723 592 723 606Q723 633 659 637Q635 637 635 648Q635 650 637 660Q641 676 643 679T653 683Q656 683 684 682T767 680Q817 680 843 681T873 682Q888 682 888 672Q888 650 880 642Q878 637 858 637Q787 633 769 597L620 7Q618 0 599 0Q585 0 582 2Q579 5 453 305L326 604L261 344Q196 88 196 79Q201 46 268 46H278Q284 41 284 38T282 19Q278 6 272 0H259Q228 2 151 2Q123 2 100 2T63 2T46 1Q31 1 31 10Q31 14 34 26T39 40Q41 46 62 46Q130 49 150 85Q154 91 221 362L289 634Q287 635 234 637Z"></path><path id="MJX-1-TEX-I-1D45B" d="M21 287Q22 293 24 303T36 341T56 388T89 425T135 442Q171 442 195 424T225 390T231 369Q231 367 232 367L243 378Q304 442 382 442Q436 442 469 415T503 336T465 179T427 52Q427 26 444 26Q450 26 453 27Q482 32 505 65T540 145Q542 153 560 153Q580 153 580 145Q580 144 576 130Q568 101 554 73T508 17T439 -10Q392 -10 371 17T350 73Q350 92 386 193T423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 180T152 343Q153 348 153 366Q153 405 129 405Q91 405 66 305Q60 285 60 284Q58 278 41 278H27Q21 284 21 287Z"></path><path id="MJX-1-TEX-N-31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path id="MJX-1-TEX-N-28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path><path id="MJX-1-TEX-I-1D458" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z"></path><path id="MJX-1-TEX-N-2217" d="M229 286Q216 420 216 436Q216 454 240 464Q241 464 245 464T251 465Q263 464 273 456T283 436Q283 419 277 356T270 286L328 328Q384 369 389 372T399 375Q412 375 423 365T435 338Q435 325 425 315Q420 312 357 282T289 250L355 219L425 184Q434 175 434 161Q434 146 425 136T401 125Q393 125 383 131T328 171L270 213Q283 79 283 63Q283 53 276 44T250 35Q231 35 224 44T216 63Q216 80 222 143T229 213L171 171Q115 130 110 127Q106 124 100 124Q87 124 76 134T64 161Q64 166 64 169T67 175T72 181T81 188T94 195T113 204T138 215T170 230T210 250L74 315Q65 324 65 338Q65 353 74 363T98 374Q106 374 116 368T171 328L229 286Z"></path><path id="MJX-1-TEX-I-1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path><path id="MJX-1-TEX-N-29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mi"><use data-c="1D447" xlink:href="#MJX-1-TEX-I-1D447"></use></g><g data-mml-node="mi" transform="translate(704,0)"><use data-c="1D43F" xlink:href="#MJX-1-TEX-I-1D43F"></use></g><g data-mml-node="mi" transform="translate(1385,0)"><use data-c="1D447" xlink:href="#MJX-1-TEX-I-1D447"></use></g><g data-mml-node="mi" transform="translate(2089,0)"><use data-c="1D43B" xlink:href="#MJX-1-TEX-I-1D43B"></use></g><g data-mml-node="mo" transform="translate(3254.8,0)"><use data-c="3D" xlink:href="#MJX-1-TEX-N-3D"></use></g><g data-mml-node="mfrac" transform="translate(4310.6,0)"><g data-mml-node="mrow" transform="translate(220,803.3)"><g data-mml-node="munderover"><g data-mml-node="mo"><use data-c="2211" xlink:href="#MJX-1-TEX-SO-2211"></use></g><g data-mml-node="TeXAtom" transform="translate(1089,477.1) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><use data-c="1D441" xlink:href="#MJX-1-TEX-I-1D441"></use></g></g><g data-mml-node="TeXAtom" transform="translate(1089,-285.4) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g><g data-mml-node="mo" transform="translate(600,0)"><use data-c="3D" xlink:href="#MJX-1-TEX-N-3D"></use></g><g data-mml-node="mn" transform="translate(1378,0)"><use data-c="31" xlink:href="#MJX-1-TEX-N-31"></use></g></g></g><g data-mml-node="mo" transform="translate(2466.9,0)"><use data-c="28" xlink:href="#MJX-1-TEX-N-28"></use></g><g data-mml-node="msub" transform="translate(2855.9,0)"><g data-mml-node="mi"><use data-c="1D458" xlink:href="#MJX-1-TEX-I-1D458"></use></g><g data-mml-node="mi" transform="translate(554,-150) scale(0.707)"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g></g><g data-mml-node="mo" transform="translate(4106.4,0)"><use data-c="2217" xlink:href="#MJX-1-TEX-N-2217"></use></g><g data-mml-node="msub" transform="translate(4828.7,0)"><g data-mml-node="mi"><use data-c="1D45E" xlink:href="#MJX-1-TEX-I-1D45E"></use></g><g data-mml-node="mi" transform="translate(479,-150) scale(0.707)"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g></g><g data-mml-node="mo" transform="translate(5781.9,0)"><use data-c="29" xlink:href="#MJX-1-TEX-N-29"></use></g></g><g data-mml-node="mi" transform="translate(2861.5,-686)"><use data-c="1D441" xlink:href="#MJX-1-TEX-I-1D441"></use></g><rect width="6370.9" height="60" x="120" y="220"></rect></g></g></g></svg>
          `,
          columns: [
            {
              headerText: "qn",
              fieldName: "sub_content_1",
              width: "60",
              height: "300",
              cssClass: "clickable-cell",
              headerTemplate: `
                <div style="height: 60px; line-height: 60px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11.647ex" height="6.74ex" role="img" focusable="false" viewBox="0 -1733 5148 2978.9" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" style="vertical-align: -2.819ex;"><defs><path id="MJX-1-TEX-LO-2211" d="M60 948Q63 950 665 950H1267L1325 815Q1384 677 1388 669H1348L1341 683Q1320 724 1285 761Q1235 809 1174 838T1033 881T882 898T699 902H574H543H251L259 891Q722 258 724 252Q725 250 724 246Q721 243 460 -56L196 -356Q196 -357 407 -357Q459 -357 548 -357T676 -358Q812 -358 896 -353T1063 -332T1204 -283T1307 -196Q1328 -170 1348 -124H1388Q1388 -125 1381 -145T1356 -210T1325 -294L1267 -449L666 -450Q64 -450 61 -448Q55 -446 55 -439Q55 -437 57 -433L590 177Q590 178 557 222T452 366T322 544L56 909L55 924Q55 945 60 948Z"></path><path id="MJX-1-TEX-I-1D45B" d="M21 287Q22 293 24 303T36 341T56 388T89 425T135 442Q171 442 195 424T225 390T231 369Q231 367 232 367L243 378Q304 442 382 442Q436 442 469 415T503 336T465 179T427 52Q427 26 444 26Q450 26 453 27Q482 32 505 65T540 145Q542 153 560 153Q580 153 580 145Q580 144 576 130Q568 101 554 73T508 17T439 -10Q392 -10 371 17T350 73Q350 92 386 193T423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 180T152 343Q153 348 153 366Q153 405 129 405Q91 405 66 305Q60 285 60 284Q58 278 41 278H27Q21 284 21 287Z"></path><path id="MJX-1-TEX-N-3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path><path id="MJX-1-TEX-N-31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path id="MJX-1-TEX-I-1D441" d="M234 637Q231 637 226 637Q201 637 196 638T191 649Q191 676 202 682Q204 683 299 683Q376 683 387 683T401 677Q612 181 616 168L670 381Q723 592 723 606Q723 633 659 637Q635 637 635 648Q635 650 637 660Q641 676 643 679T653 683Q656 683 684 682T767 680Q817 680 843 681T873 682Q888 682 888 672Q888 650 880 642Q878 637 858 637Q787 633 769 597L620 7Q618 0 599 0Q585 0 582 2Q579 5 453 305L326 604L261 344Q196 88 196 79Q201 46 268 46H278Q284 41 284 38T282 19Q278 6 272 0H259Q228 2 151 2Q123 2 100 2T63 2T46 1Q31 1 31 10Q31 14 34 26T39 40Q41 46 62 46Q130 49 150 85Q154 91 221 362L289 634Q287 635 234 637Z"></path><path id="MJX-1-TEX-N-28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path><path id="MJX-1-TEX-I-1D458" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z"></path><path id="MJX-1-TEX-N-2217" d="M229 286Q216 420 216 436Q216 454 240 464Q241 464 245 464T251 465Q263 464 273 456T283 436Q283 419 277 356T270 286L328 328Q384 369 389 372T399 375Q412 375 423 365T435 338Q435 325 425 315Q420 312 357 282T289 250L355 219L425 184Q434 175 434 161Q434 146 425 136T401 125Q393 125 383 131T328 171L270 213Q283 79 283 63Q283 53 276 44T250 35Q231 35 224 44T216 63Q216 80 222 143T229 213L171 171Q115 130 110 127Q106 124 100 124Q87 124 76 134T64 161Q64 166 64 169T67 175T72 181T81 188T94 195T113 204T138 215T170 230T210 250L74 315Q65 324 65 338Q65 353 74 363T98 374Q106 374 116 368T171 328L229 286Z"></path><path id="MJX-1-TEX-I-1D45E" d="M33 157Q33 258 109 349T280 441Q340 441 372 389Q373 390 377 395T388 406T404 418Q438 442 450 442Q454 442 457 439T460 434Q460 425 391 149Q320 -135 320 -139Q320 -147 365 -148H390Q396 -156 396 -157T393 -175Q389 -188 383 -194H370Q339 -192 262 -192Q234 -192 211 -192T174 -192T157 -193Q143 -193 143 -185Q143 -182 145 -170Q149 -154 152 -151T172 -148Q220 -148 230 -141Q238 -136 258 -53T279 32Q279 33 272 29Q224 -10 172 -10Q117 -10 75 30T33 157ZM352 326Q329 405 277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q233 26 290 98L298 109L352 326Z"></path><path id="MJX-1-TEX-N-29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="munderover"><g data-mml-node="mo"><use data-c="2211" xlink:href="#MJX-1-TEX-LO-2211"></use></g><g data-mml-node="TeXAtom" transform="translate(58,-1087.9) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g><g data-mml-node="mo" transform="translate(600,0)"><use data-c="3D" xlink:href="#MJX-1-TEX-N-3D"></use></g><g data-mml-node="mn" transform="translate(1378,0)"><use data-c="31" xlink:href="#MJX-1-TEX-N-31"></use></g></g><g data-mml-node="TeXAtom" transform="translate(408,1150) scale(0.707)" data-mjx-texclass="ORD"><g data-mml-node="mi"><use data-c="1D441" xlink:href="#MJX-1-TEX-I-1D441"></use></g></g></g><g data-mml-node="mo" transform="translate(1444,0)"><use data-c="28" xlink:href="#MJX-1-TEX-N-28"></use></g><g data-mml-node="msub" transform="translate(1833,0)"><g data-mml-node="mi"><use data-c="1D458" xlink:href="#MJX-1-TEX-I-1D458"></use></g><g data-mml-node="mi" transform="translate(554,-150) scale(0.707)"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g></g><g data-mml-node="mo" transform="translate(3083.5,0)"><use data-c="2217" xlink:href="#MJX-1-TEX-N-2217"></use></g><g data-mml-node="msub" transform="translate(3805.7,0)"><g data-mml-node="mi"><use data-c="1D45E" xlink:href="#MJX-1-TEX-I-1D45E"></use></g><g data-mml-node="mi" transform="translate(479,-150) scale(0.707)"><use data-c="1D45B" xlink:href="#MJX-1-TEX-I-1D45B"></use></g></g><g data-mml-node="mo" transform="translate(4759,0)"><use data-c="29" xlink:href="#MJX-1-TEX-N-29"></use></g></g></g></svg>

                  </div>
              `,
            },
            {
              headerText: "N",
              fieldName: "sub_content_1",
              width: "60",
              cssClass: "clickable-cell",
              headerCssClass: "text-center",
            },
            {
              headerText: "TLTH",
              fieldName: "sub_content_1",
              width: "60",
              headerCssClass: "text-center",
            },
            {
              headerText: "Điểm",
              fieldName: "sub_content_2",
              width: "60",
              headerCssClass: "text-center",
            },
          ],
        },
      ],
      search: {
        text_search: "",
        department_id: -1,
        center_id:
          parseInt(import.meta.env.VNPT_DEFAULT_CENTER_ID_REPORT_I10) || -1,
        user_id: -1,
        month: new Date(),
        muc_do_id: -1,
      },
      departments: [],
      dataList: [],
      users: [],
      centers: [],
      // Pagination settings
      pageSettings: {
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        currentPage: 1,
      },
      mucDoList: [
        { id: -1, text: "Tất cả" },
        { id: 1, text: "Bình thường" },
        { id: 2, text: "Quan trọng" },
        { id: 3, text: "Rất quan trọng" },
      ],
    };
  },
  watch: {
    "search.month": {
      handler(newMonth, oldMonth) {
        this.onSearch();
      },
      immediate: false, // Không trigger ngay khi component mount
    },
    "search.department_id": {
      handler(newDepartmentId, oldDepartmentId) {
        if (newDepartmentId !== -1) {
          // Load users của department được chọn
          this.loadUserByDepartment(newDepartmentId);
        } else {
          this.users = [];
        }
        this.search.user_id = -1;
        this.onSearch();
        // Refresh data với department mới
        // this.refreshData();
      },
      immediate: false, // Không trigger ngay khi component mount
    },
    "search.user_id": {
      handler(newUserId, oldUserId) {
        this.onSearch();
      },
      immediate: false,
    },
    "search.muc_do_id": {
      handler(newMucDoId, oldMucDoId) {
        this.onSearch();
      },
      immediate: false,
    },
    "search.center_id": {
      handler(newCenterId, oldCenterId) {
        if (newCenterId !== -1) {
          this.GetUnitByParentId([newCenterId], 3);
        } else {
          this.centers = [];
          this.search.center_id = -1;
        }
        this.onSearch();
      },
      immediate: false,
    },
  },
  async mounted() {
    // Debug environment variable
    this.search.center_id =
      import.meta.env.VNPT_DEFAULT_CENTER_ID_REPORT_I10 || -1;
    await Promise.all([
      // this.loadDepartments(),
      this.GetPermissionButtons(),
      this.GetUnitByParentId([0], 2),
    ]).then(() => {
      // Initial data load if necessary
      this.onSearch();
    });
  },
  computed: {
    // Pagination computed properties
    totalRecords() {
      return this.dataList.length;
    },
    totalPages() {
      return Math.ceil(this.totalRecords / this.pageSettings.pageSize);
    },
    startRecord() {
      return (
        (this.pageSettings.currentPage - 1) * this.pageSettings.pageSize + 1
      );
    },
    endRecord() {
      const end = this.pageSettings.currentPage * this.pageSettings.pageSize;
      return Math.min(end, this.totalRecords);
    },
    paginatedData() {
      const start =
        (this.pageSettings.currentPage - 1) * this.pageSettings.pageSize;
      const end = start + this.pageSettings.pageSize;
      return this.dataList.slice(start, end);
    },
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.pageSettings.currentPage;

      if (total <= 7) {
        // Show all pages if total <= 7
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1); // Always show first page

        if (current <= 4) {
          // Near start: 1, 2, 3, 4, 5, ..., last
          for (let i = 2; i <= 5; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(total);
        } else if (current >= total - 3) {
          // Near end: 1, ..., last-4, last-3, last-2, last-1, last
          pages.push("...");
          for (let i = total - 4; i <= total; i++) {
            pages.push(i);
          }
        } else {
          // Middle: 1, ..., current-1, current, current+1, ..., last
          pages.push("...");
          pages.push(current - 1);
          pages.push(current);
          pages.push(current + 1);
          pages.push("...");
          pages.push(total);
        }
      }

      return pages;
    },
  },
  methods: {
    async loadDepartments() {
      try {
        const response = await API.getDepartmentForAccount();
        this.departments = response.data.map((dept) => ({
          id: dept.department_id,
          text: dept.name,
        }));
        // this.departments.unshift({ id: -1, text: "Tất cả" });
      } catch (error) {
        console.error("Error loading departments:", error);
      }
    },
    async GetUnitByParentId(arrParentId, level) {
      try {
        if (level == 2) {
          arrParentId = JSON.stringify(arrParentId);
          const response = await API.GetUnitByParentId(arrParentId, level);
          this.centers = response.data.map((unit) => ({
            id: unit.department_id,
            text: unit.name,
            parent_id: unit.parent_id,
          }));
          if (this.centers.length > 0) {
            this.centers.unshift({ id: -1, text: "Tất cả" });
          } else {
            this.departments = [];
            this.search.center_id = -1;
            this.search.department_id = -1;
          }
        }
        if (level == 3) {
          arrParentId = JSON.stringify(arrParentId);
          const response = await API.GetUnitByParentId(arrParentId, level);
          this.departments = response.data.map((unit) => ({
            id: unit.department_id,
            text: unit.name,
            parent_id: unit.parent_id,
          }));
          this.departments.unshift({ id: -1, text: "Tất cả" });
        }
      } catch (error) {
        console.error("Error getting unit by parent ID:", error);
        return [];
      }
    },
    async loadUserByDepartment(departmentId) {
      try {
        const response = await API.getUserByDepartment(departmentId);
        this.users = response.data.map((user) => ({
          id: user.user_id,
          text: user.full_name,
        }));
        if (this.users.length !== 0) {
          this.users.unshift({ id: -1, text: "Tất cả nhân sự" });
          this.search.user_id = -1;
          return;
        }
      } catch (error) {
        console.error("Error loading users by department:", error);
        return [];
      }
    },
    async onSearch() {
      // Prevent multiple searches
      if (this.searching) return;

      // Clear existing timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searching = true;

      try {
        // Format dates to MM/yyyy if they exist
        const formatToMonthYear = (date) => {
          if (!date) return null;
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${month}/${year}`;
        };

        const request = {
          center_id: this.search.center_id,
          department_id: this.search.department_id,
          user_id: this.search.user_id,
          priority: this.search.muc_do_id,
          month: formatToMonthYear(this.search.month),
        };

        const response = await API.getReportI10EvaluationDashboard(request);
        const data = JSON.parse(response.data ?? []);
        if (data && data.filter((_) => !_.is_total_row).length > 0) {
          this.dataList = data;
        } else {
          this.dataList = [];
        }
      } catch (error) {
        console.error("API Error:", error);

        // Show error feedback
        if (this.$toast) {
          this.$toast.error("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!");
        }
      } finally {
        // Debounce search to prevent spam
        this.searchTimeout = setTimeout(async () => {
          this.searching = false;
        }, 300); // 300ms debounce
      }
    },
    // Grid event handlers
    onRecordClick(args) {},
    onRowSelected(args) {},
    onRowDeselected(args) {},
    // Pagination methods
    goToPage(page) {
      if (
        page >= 1 &&
        page <= this.totalPages &&
        page !== this.pageSettings.currentPage
      ) {
        this.pageSettings.currentPage = page;
      }
    },
    onPageSizeChange() {
      // Reset to first page when changing page size
      this.pageSettings.currentPage = 1;
    },
    formatDecimal(value) {
      if (value === null || value === undefined) return "0.00";
      return parseFloat(value).toFixed(2);
    },
    async openDetailModal(item, column) {
      try {
        const month = this.search.month
          ? new Date(this.search.month).getMonth() +
            1 +
            "/" +
            new Date(this.search.month).getFullYear()
          : "Không xác định";
        const keyMap = new Map([
          ["tong_tgtt_dunghan", 2],
          ["tong_tgtt_quahan", 3],
          ["tong_tgctt_quahan", 4],
          ["tong_task", -1],
          ["tong_danh_gia_trong_so", 5],
          ["tong_danh_gia", 5],
        ]);
        // Gọi API getReportI10Details để lấy danh sách task chi tiết
        const response = await API.getReportI10Details(
          this.search.muc_do_id,
          this.search.center_id,
          keyMap.get(column.columnKey) ?? 0,
          this.search.department_id,
          item.user_id || this.search.user_id,
          this.search.month
        );

        // Gắn dữ liệu task từ API vào item
        // Handle both cases: already parsed object or JSON string
        let tasksData = [];
        if (response.data) {
          if (typeof response.data === 'string') {
            try {
              tasksData = JSON.parse(response.data);
            } catch (e) {
              console.warn('Failed to parse response.data:', response.data, e);
              tasksData = [];
            }
          } else if (Array.isArray(response.data)) {
            tasksData = response.data;
          } else if (typeof response.data === 'object') {
            tasksData = [response.data];
          }
        }
        item.tasks = tasksData;
        const index = this.paginatedData.findIndex(_ => _.task_id == item.task_id);
        let text = null;
        if (index !== -1 && index + 1 < this.paginatedData.length) {
          text = this.paginatedData[index + 1].phongban;
        }

        item.phongban = item.is_total_row == 1 && this.search.department_id != -1 ? text : item.phongban;

        // Gọi modal và hiển thị dữ liệu
        this.$refs.detailModal.showModal(item, column, month);
      } catch (error) {
        console.error("Error loading detail data:", error);
        this.$notify({
          title: "Lỗi",
          message: "Không thể tải dữ liệu chi tiết",
          type: "error",
        });
      }
    },
    async exportToExcel() {
      try {
        // Kiểm tra có dữ liệu (bỏ qua total_row)
        const validData = this.dataList.filter((item) => !item.is_total_row);
        if (validData.length === 0) {
          this.$notify({
            title: "Thông báo",
            message: "Không có dữ liệu để xuất",
            type: "warning",
          });
          return;
        }

        this.searching = true;

        // Tạo tên file với tháng
        const month = this.search.month
          ? new Date(this.search.month).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
            })
          : new Date().toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
            });

        const fileName = `Báo cáo số liệu đánh giá tự động chỉ tiêu I10 tháng ${month}.xlsx`;

        // Tạo workbook
        const workbook = XLSX.utils.book_new();

        // Sheet 1: Chi tiết
        const allTasksData = [];
        try {
          const response = await API.getReportI10Details(
            this.search.muc_do_id,
            this.search.center_id,
            -1,
            this.search.department_id,
            this.search.user_id,
            this.search.month
          );
          let tasksData = response.data;

          // Parse nếu response.data là string JSON
          if (typeof tasksData === "string") {
            tasksData = JSON.parse(tasksData);
          }

          if (tasksData && Array.isArray(tasksData)) {
            tasksData.forEach((task) => {
              allTasksData.push({
                department_name: task.department_name || "-",
                center_name: task.center_name || "-",
                ...mapTaskData(task),
              });
            });
          }
        } catch (err) {
          console.warn(`Error loading tasks detail:`, err);
        }

        if (allTasksData.length > 0) {
          // 1️⃣ Tạo header
          const detailHeaders = [
            "Trung tâm",
            "Phòng ban",
            ...DETAIL_COLUMNS.map((col) => col.label),
          ];

          // 2️⃣ Tạo data rows
          const detailDataRows = allTasksData.map((item) => {
            const row = [];

            row.push(item.center_name || "-");
            row.push(item.department_name || "-");

            DETAIL_COLUMNS.forEach((col) => {
              row.push(item[col.key] || "-");
            });
            return row;
          });

          // 3️⃣ Tạo sheet
          const detailSheet = XLSX.utils.aoa_to_sheet([
            detailHeaders,
            ...detailDataRows,
          ]);

          // 4️⃣ Thiết lập độ rộng cột
          const detailColWidths = [
            { wch: 20 }, // Phòng ban
            ...DETAIL_COLUMNS.map((col) => ({
              wch: Math.max(15, col.label.length + 2),
            })),
          ];
          detailSheet["!cols"] = detailColWidths;

          // 5️⃣ In đậm header
          detailHeaders.forEach((header, index) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index }); // r=0 = hàng đầu tiên
            if (!detailSheet[cellAddress]) return;
            detailSheet[cellAddress].s = {
              font: { bold: true },
              alignment: { horizontal: "center", vertical: "center" },
              fill: { fgColor: { rgb: "E7E6E6" } }, // Màu nền nhạt cho header
            };
          });

          // 6️⃣ Thêm sheet vào workbook
          XLSX.utils.book_append_sheet(workbook, detailSheet, "Chi tiết");
        }

        // Xuất file
        XLSX.writeFile(workbook, fileName);

        this.$notify({
          title: "Thành công",
          message: `Xuất file Excel thành công: ${fileName}`,
          type: "success",
        });
      } catch (error) {
        console.error("Error exporting to Excel:", error);
      } finally {
        this.searching = false;
      }
    },
  },
  beforeDestroy() {
    // Clean up timeout when component is destroyed
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
};
</script>
<style scoped>
:deep(.e-grid .e-gridheader .e-sortfilter .e-headercelldiv) {
  height: 80px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 5px;
}
:deep(.grid-ext .e-grid .e-headercell:first-child) {
  border-left-style: solid !important;
  border-left-color: #fff !important;
  border-left-width: 1px !important;
}

:deep(.e-grid .e-gridheader .e-columnheader:last-child .e-headercell) {
  border-top-style: solid !important;
  border-top-color: #fff !important;
  border-top-width: 1px !important;
}

.i10_evaluation_dashboard .main-form {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
}

/* Search button styling */
.i10_evaluation_dashboard .search-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
}

.i10_evaluation_dashboard .search-btn:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.i10_evaluation_dashboard .search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #6c757d !important;
  transform: none;
  box-shadow: none;
}

.i10_evaluation_dashboard .search-btn.searching {
  background-color: #28a745;
}

.i10_evaluation_dashboard .search-btn i {
  font-size: 14px;
}

/* Spinner animation */
.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Input field disabled styling when searching */
.i10_evaluation_dashboard .search-box select:disabled,
.i10_evaluation_dashboard .search-box .e-input-group.e-disabled input {
  opacity: 0.7;
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.i10_evaluation_dashboard .section-btn {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.i10_evaluation_dashboard .section-btn .btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.i10_evaluation_dashboard .section-btn .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.i10_evaluation_dashboard .section-btn .btn i {
  font-size: 14px;
}

.i10_evaluation_dashboard .section-list {
  margin-top: 20px;
  overflow-x: auto;
}

.i10_evaluation_dashboard .section-list section {
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}
.search-box .info-row {
  display: flex;
  flex-direction: column;
}

.search-box .info-row .input-row {
  display: flex;
}

.search-box .info-row .key {
  font-weight: bold;
}

.search-box .info-row .value:first-child {
  flex: 1;
  padding-left: 0;
}
.section-btn {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.section-btn .btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

th,
td {
  border: 1px solid #b0d9f9;
  padding: 10px 12px;
  text-align: left;
  vertical-align: middle;
}

/* --- Phần Header --- */
thead {
  background-color: #e0f2fe;
  color: #0b4f8c; /* Màu chữ xanh đậm */
}

thead th {
  text-align: center;
  font-weight: bold;
  vertical-align: middle;
}

/* Style cho các công thức */
.formula {
  font-style: italic;
  font-size: 0.9em;
  color: #0b4f8c;
}

/* --- Phần Body --- */
tbody tr:nth-child(even) {
  background-color: #f8fbfe;
}

tbody tr:hover {
  background-color: #f0f8ff;
}

/* --- Phần Footer --- */
tfoot {
  background-color: #0b4f8c; /* Nền xanh đậm */
  color: white;
  font-size: 0.9em;
}

tfoot td {
  border-color: #0b4f8c;
}

/* Pagination Styles */
.pagination-wrapper {
  padding: 15px 0;
  border-top: 1px solid #dee2e6;
  margin-top: 20px;
}

.pagination-info {
  font-size: 14px;
  color: #6c757d;
}

.pagination-size {
  font-size: 14px;
  color: #6c757d;
}

.pagination-size .form-select {
  margin: 0 5px;
  width: 80px !important;
}

.pagination .page-link {
  color: #0b4f8c;
  border: 1px solid #dee2e6;
  padding: 6px 12px;
  font-size: 14px;
}

.pagination .page-link:hover {
  color: #fff;
  background-color: #0b4f8c;
  border-color: #0b4f8c;
}

.pagination .page-item.active .page-link {
  background-color: #0b4f8c;
  border-color: #0b4f8c;
  color: #fff;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  background-color: #fff;
  border-color: #dee2e6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .pagination-wrapper {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .pagination-wrapper .pagination {
    justify-content: center;
  }
}

.clickable-cell {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.clickable-cell:hover {
  background-color: #e3f2fd;
  font-weight: 500;
  box-shadow: inset 0 0 0 1px #2196f3;
}

.clickable-cell:active {
  background-color: #bbdefb;
}
.main-form {
  min-height: 100vh !important;
  padding-bottom: 40px !important;
}
.btn-excel{
  width: 150px;
}
@media screen and (max-width: 768px) {
  .main-wrapper {
    padding-bottom: 30px !important;
  }
  .btn-excel{
    width: 100%;
  }
  .main-form {
    padding-bottom: 40px !important;
  }
}
</style>
