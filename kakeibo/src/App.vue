<template>
  <amplify-authenticator>
    <p class="atenson">ﾋﾟﾝﾎﾟﾝﾊﾟﾝ This is a portfolio created by Tsuchiya.</p>
    <h1><span class="title">家計簿アプリ</span></h1>
    <div
      id="main"
      :class="{ 'modal-on': isModal }"
      v-if="authState === 'signedin' && user"
    >
      <LoadingScreen :isLoading="isLoading" />

      <div class="graph">
        <BarChart
          :chartData="barData"
          :options="barOptions"
          style="height: 50vh"
        />
      </div>
      <h2>{{ toMonth }}月</h2>
      <div class="flex-between">
        <p>支出合計</p>
        <p>{{ toFormatYen(toMonthTotal) }}円</p>
      </div>
      <div class="list">
        <h2>&ensp;出金一覧</h2>
        <ul>
          <li
            @click="modalOn('edit', kakeibo)"
            v-for="kakeibo in kakeibos"
            :key="kakeibo.id"
          >
            <span class="grow"
              >{{ kakeibo.category
              }}<span
                v-if="kakeibo.comment"
                class="material-symbols-outlined cloud-icon"
                @click="modalOff()"
                >chat</span
              ></span
            >
            <span>{{ toFormatYen(kakeibo.price) }}円</span>
            <span class="list-date">{{ listDate(kakeibo.date) }}</span>
            <span class="material-symbols-outlined edit">edit</span>
            <div v-if="kakeibo.comment" class="cloud">
              <span>{{ kakeibo.comment }}</span>
            </div>
          </li>
        </ul>
        <button
          @click="getKakeibos"
          class="more-button"
          :style="{ visibility: visibilityMoreButton }"
        >
          <span class="material-symbols-outlined">more_vert</span>
        </button>
      </div>
      <div id="bg" @click="modalOff()"></div>
      <div id="modal">
        <span class="material-symbols-outlined close" @click="modalOff"
          >close</span
        >
        <div id="modal-inner-form" :style="{ display: displayForm }">
          <label
            >値段*
            <input type="number" v-model="price" placeholder="ex.3680" />
          </label>
          <label
            >カテゴリー*
            <input
              type="text"
              list="category"
              v-model="category"
              placeholder="入力するか選択してください"
            />
            <datalist id="category">
              <option>食費</option>
              <option>衣類</option>
              <option>日用品・雑貨</option>
              <option>医療費</option>
              <option>交通費</option>
              <option>趣味・旅行</option>
              <option>公共料金</option>
              <option>家賃</option>
              <option>その他</option>
            </datalist>
          </label>
          <label
            >お店*
            <input
              type="text"
              list="shopname"
              v-model="shopName"
              placeholder="入力するか選択してください"
            />
            <datalist id="shopname">
              <option value="スーパー"></option>
              <option value="コンビニ"></option>
              <option value="飲食店"></option>
              <option value="ドラッグストア"></option>
              <option value="病院"></option>
              <option value="ホームセンター"></option>
              <option value="その他"></option>
            </datalist>
          </label>
          <label
            >コメント
            <input type="text" v-model="comment" placeholder="メモなど" />
          </label>
          <label
            >日付*
            <input type="date" v-model="date" :max="maxDate" :min="minDate" />
          </label>
          <input type="hidden" v-model="id" />
          <input type="hidden" v-model="owner" />
          <button :style="{ display: displayAdd }" @click="createKakeibo">
            保存
          </button>
          <button :style="{ display: displayEdit }" @click="updateKakeibo">
            保存
          </button>
          <button
            class="delete"
            :style="{ display: displayEdit }"
            @click="deleteKakeibo"
          >
            削除
          </button>
        </div>
        <div id="modal-inner-guide" :style="{ display: displayguide }">
          <p>入力フォームはコメント以外必須です。</p>
          <p>日付は前後1年間まで指定可です。</p>
          <br />
          <p>土屋が制作したポートフォリオです。</p>
          <p>環境：AWS Amplify、Cognito(認証)、Lambda、DynamoDB(DB) etc.</p>
          <p>FW:Vue</p>
          <p>グラフ：vue-chart-3</p>
          <br />
          <p>
            もしよろしければ、アドバイス等いただけると幸いです。<br />→<a
              @click="
                modalOff();
                modalOn('hyouka');
              "
              href="javascript:void(0)"
              >こちらから</a
            >
          </p>
          <br />
          <p>
            <a href="URL TODO">GitHub</a>
            ※直リンクでのみ閲覧可のリポジトリです。
          </p>
          <p>
            Mail: <a href="mailto:tsuwuchiya@gmail.com">tsuwuchiya@gmail.com</a>
          </p>
        </div>
        <div id="modal-inner-hyouka" :style="{ display: displayHyouka }">
          <form>
            <textarea
              placeholder="評価・感想などをご入力ください"
              v-model="hyouka"
              rows="5"
            ></textarea>
            <button
              type="button"
              @click="sendHyouka(hyouka)"
              style="display: block; margin: auto; margin-right: 0"
            >
              送信
            </button>
            <p style="color: #888; font-size: 0.8em">
              改修予定（するかも？）<br />
              ・入力項目に「支払い方法」の追加<br />
              ・選択した「カテゴリー」によって<br />
              　ある程度「お店」をフィルタ、もしくはソート<br />
              ・「カテゴリー」、「お店」にて、入力した<br />
              　新規のものを項目に追加<br />
              ・画像アップロード<br />
              ・OCR（レシート画像の文字おこし）<br />
              ・テーマ（外観）切り替え<br />
              ・グラフ切り替え<br />
              ・一覧ソート<br />
              ・収入の登録<br />
              ・LINEなどに通知（夫婦で共有等）<br />
              ・エクスポート、インポート
            </p>
          </form>
        </div>
      </div>
      <div id="message" :style="{ 'animation-name': animationMsg }">
        {{ Msg }}
      </div>
      <nav>
        <button class="guide" @click="modalOn('guide')">ガイド</button>
        <button class="add" @click="modalOn('add')">入力</button>
        <button class="feedback" @click="modalOn('hyouka')">評価</button>
        <amplify-sign-out></amplify-sign-out>
      </nav>
    </div>
    <div class="copyright">
      <a target="_blank" href="https://github.com/tsuwuchiya">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="32"
          height="32"
        >
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
      </a>
      <p>&copy; {{ toYear }} Tsuchiya.</p>
    </div>
  </amplify-authenticator>
</template>

<script>
import { API } from "aws-amplify";

import {
  createKakeibo,
  updateKakeibo,
  deleteKakeibo,
} from "./graphql/mutations";
import { listKakeibos, kakeiboByOwnerAndDate } from "./graphql/queries";

import { useHead } from "@vueuse/head";

import { onAuthUIStateChange } from "@aws-amplify/ui-components";

import { I18n } from "aws-amplify";
import { Translations } from "@aws-amplify/ui-components";

I18n.putVocabulariesForLanguage("ja", {
  [Translations.SIGN_IN_HEADER_TEXT]: "ログインしてください",
  [Translations.SIGN_IN_ACTION]: "ログイン",
  [Translations.SIGN_OUT]: "ログアウト",
  [Translations.USERNAME_LABEL]: "ユーザー名 *",
  [Translations.PASSWORD_LABEL]: "パスワード *",
  [Translations.USERNAME_PLACEHOLDER]: " ",
  [Translations.PASSWORD_PLACEHOLDER]: " ",
  [Translations.SIGN_IN_TEXT]: "ログイン",
  [Translations.SIGN_IN_ACTION]: "ログイン",
  [Translations.FORGOT_PASSWORD_TEXT]: " ",
  [Translations.RESET_PASSWORD_TEXT]: "パスワードを忘れた方はコチラ",
  [Translations.NO_ACCOUNT_TEXT]: " ",
  [Translations.CREATE_ACCOUNT_TEXT]: "新規登録",
  [Translations.RESET_YOUR_PASSWORD]: "新しいパスワードを発行する",
  [Translations.BACK_TO_SIGN_IN]: "戻る",
  [Translations.SIGN_UP_HEADER_TEXT]: "新規登録",
  [Translations.SIGN_UP_PASSWORD_PLACEHOLDER]: " ",
  [Translations.EMAIL_LABEL]: "メールアドレス *",
  [Translations.SIGN_UP_EMAIL_PLACEHOLDER]: "you@example.com",
  [Translations.PHONE_LABEL]: "電話番号 *",
  [Translations.VERIFY_CONTACT_PHONE_LABEL]: "電話番号 *",
  [Translations.SIGN_UP_HAVE_ACCOUNT_TEXT]: "登録済み",
  [Translations.CONFIRM_SIGN_UP_HEADER_TEXT]: "受信した認証コードを入力",
  [Translations.CONFIRM_SIGN_UP_CODE_LABEL]: "認証コード *",
  [Translations.CONFIRM_SIGN_UP_CODE_PLACEHOLDER]: " ",
  [Translations.CONFIRM_SIGN_UP_LOST_CODE]: " ",
  [Translations.CONFIRM_SIGN_UP_RESEND_CODE]: "もう一度送る",
  [Translations.CONFIRM]: "確認",
  [Translations.SEND_CODE]: "認証コードを送信する",
  [Translations.CODE_LABEL]: "認証コード *",
  [Translations.CODE_PLACEHOLDER]: " ",
  [Translations.NEW_PASSWORD_LABEL]: "新しいパスワード *",
  [Translations.NEW_PASSWORD_PLACEHOLDER]: " ",
  [Translations.SUBMIT]: "変更",
});

import { Chart, registerables } from "chart.js";
import { BarChart } from "vue-chart-3";
Chart.register(...registerables);

import moment from "moment";
import axios from "axios";

import LoadingScreen from "./components/LoadingScreen.vue";

const LIMIT = 15;
const DATE_FORMAT = "YYYY-MM-DD";
const BACK_MONTH = 6;
const MESSAGE = "message";
const ERROR_MESSAGE = "err-message";

export default {
  name: "app",
  async created() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      this.isLoading = true;
      this.authState = authState;
      this.user = authData;
      if (authData) {
        this.owner = authData.attributes.sub + "::" + authData.username;
        this.getKakeibos(); // ↑のsubを使用するので
        this.getTotals();
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });
    window.addEventListener("beforeunload", this.confirmSave);
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.confirmSave);
  },
  components: {
    BarChart,
    LoadingScreen,
  },
  setup() {
    useHead({
      title: "【家計簿アプリ】 | ポートフォリオ_Tsuchiya",
      meta: [
        {
          name: "viewport",
          content: "width=device-width,initial-scale=1.0,user-scalable=no",
        },
        { charset: "utf-8" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: true,
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=RocknRoll+One&Sawarabi+Gothic&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0",
        },
      ],
    });
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
      owner: undefined,
      formFields: [{ type: "username" }, { type: "password" }],

      id: "",
      shopName: "",
      price: "",
      category: "",
      comment: "",
      date: moment().format(DATE_FORMAT),
      toMonth: moment().format("M"),
      toYear: moment().format("YYYY"),
      maxDate: moment().add(12, "month").format(DATE_FORMAT),
      minDate: moment().add(-12, "month").format(DATE_FORMAT),
      kakeibos: [],
      totals: [],
      nextToken: null,
      hyouka: "",
      Msg: "",
      animationMsg: "none",

      isLoading: true,
      isModal: false,
      isConfirm: false,
      visibilityMoreButton: "visible",
      displayAdd: "none",
      displayEdit: "none",
      displayForm: "none",
      displayguide: "none",
      displayHyouka: "none",
    };
  },
  beforeUnmount() {
    this.unsubscribeAuth();
  },
  methods: {
    /**
     * 3桁カンマ
     */
    toFormatYen(price) {
      return Number(price).toLocaleString();
    },

    /**
     * 一覧用に日付フォーマット
     */
    listDate(date) {
      return moment(date).format("'YY/MM/DD");
    },

    /**
     * モーダル表示
     */
    modalOn(t, data) {
      this.isModal = true;
      switch (t) {
        case "guide":
          this.displayguide = "block";
          break;
        case "add":
          this.isConfirm = true;
          this.displayAdd = "block";
          this.displayForm = "flex";
          break;
        case "edit":
          this.isConfirm = true;
          this.displayEdit = "block";
          this.displayForm = "flex";
          this.id = data.id;
          this.shopName = data.shopName;
          this.price = data.price;
          this.category = data.category;
          this.comment = data.comment;
          this.date = moment(data.date).format(DATE_FORMAT);
          break;
        case "hyouka":
          this.isConfirm = true;
          this.displayHyouka = "block";
          break;
      }
    },

    /**
     * モーダルを閉じる
     * “入力をやめますか？”の確認ダイアログを表示する
     */
    modalOff() {
      // モーダル閉じる前に確認
      if (this.isConfirm && !confirm("入力を中断しますか？")) return;

      // モーダルリセット
      this.isModal = false;
      this.isConfirm = false;
      this.displayAdd = "none";
      this.displayEdit = "none";
      this.displayForm = "none";
      this.displayguide = "none";
      this.displayHyouka = "none";

      // 入力フォーム初期化
      this.shopName = "";
      this.price = "";
      this.category = "";
      this.comment = "";
      this.date = moment().format(DATE_FORMAT);
      this.hyouka = "";
    },

    /**
     * 追加
     */
    async createKakeibo() {
      const { price, category, shopName, comment, date, owner } = this;

      if (!price || !category || !shopName || !date) {
        this.showMsg("(*)の付いた項目を入力してください。", ERROR_MESSAGE);
        return;
      }
      const kakeibo_data = {
        price,
        category,
        shopName,
        comment,
        date,
        owner,
      };
      let res;
      try {
        res = await API.graphql({
          query: createKakeibo,
          variables: { input: kakeibo_data },
        });
      } catch (e) {
        this.showMsg("保存に失敗しました。", ERROR_MESSAGE);
        this.slackNotices(
          "Err: " +
            JSON.stringify(e) +
            "\nInput: " +
            JSON.stringify(kakeibo_data)
        );
        return;
      }

      this.showMsg("保存しました。");

      // 一覧に追加
      this.kakeibos = [res.data.createKakeibo, ...this.kakeibos];

      this.getTotals();

      this.isConfirm = false;
      this.modalOff();
    },

    /**
     * 更新
     */
    async updateKakeibo() {
      const { id, price, category, shopName, comment, date } = this;
      if (!price || !category || !shopName || !date) return;
      const kakeibo_data = {
        id,
        price,
        category,
        shopName,
        comment,
        date,
      };

      let res;
      try {
        res = await API.graphql({
          query: updateKakeibo,
          variables: { input: kakeibo_data },
        });
      } catch (e) {
        this.showMsg("更新に失敗しました。", ERROR_MESSAGE);
        this.slackNotices(
          "Err: " +
            JSON.stringify(e) +
            "\nInput: " +
            JSON.stringify(kakeibo_data)
        );
        return;
      }

      this.showMsg("更新しました");

      const index = this.kakeibos.findIndex(
        ({ id }) => id === res.data.updateKakeibo.id
      );
      this.kakeibos.splice(index, 1, kakeibo_data);

      this.getTotals();

      this.isConfirm = false;
      this.modalOff();
    },

    /**
     * 削除
     */
    async deleteKakeibo() {
      if (!confirm("本当に削除しますか？")) return;
      const { id } = this;
      const kakeibo_data = {
        id,
      };

      let res;
      try {
        res = await API.graphql({
          query: deleteKakeibo,
          variables: { input: kakeibo_data },
        });
      } catch (e) {
        this.showMsg("削除に失敗しました。", ERROR_MESSAGE);
        this.slackNotices(
          "Err: " +
            JSON.stringify(e) +
            "\nInput: " +
            JSON.stringify(kakeibo_data)
        );
        return;
      }

      this.showMsg("削除しました。");

      const index = this.kakeibos.findIndex(
        ({ id }) => id === res.data.deleteKakeibo.id
      );
      this.kakeibos.splice(index, 1);

      this.getTotals();

      this.isConfirm = false;
      this.modalOff();
    },

    /**
     * 取得
     */
    async getKakeibos() {
      const nextToken = this.nextToken;

      try {
        const kakeibos = await API.graphql({
          query: kakeiboByOwnerAndDate,
          variables: {
            owner: this.owner,
            limit: LIMIT,
            sortDirection: "DESC",
            nextToken,
          },
        });

        // 一覧に追加
        this.kakeibos = [
          ...this.kakeibos,
          ...kakeibos.data.kakeiboByOwnerAndDate.items,
        ];
        this.nextToken = kakeibos.data.kakeiboByOwnerAndDate.nextToken;

        // 最後までいったら非表示
        if (!this.nextToken) {
          this.visibilityMoreButton = "hidden";
        }
      } catch (e) {
        this.showMsg("一覧の取得に失敗しました。", ERROR_MESSAGE);
        this.slackNotices("Err: " + JSON.stringify(e));
      }
    },

    /**
     * グラフ生成用データ取得
     */
    async getTotals() {
      try {
        // 過去、BACK_MONTH月分のデータを取得するためのフィルター
        let filter = {
          date: {
            between: [
              moment()
                .add(1 - BACK_MONTH, "months")
                .startOf("month")
                .format(DATE_FORMAT),
              moment().endOf("month").format(DATE_FORMAT),
            ],
          },
        };
        let kakeibos = [];
        let nextToken = null;
        do {
          const res = await API.graphql({
            query: listKakeibos,
            variables: {
              filter: filter,
              nextToken,
            },
          });
          kakeibos = [...kakeibos, ...res.data.listKakeibos.items];
          nextToken = res.data.listKakeibos.nextToken;
        } while (nextToken);
        // 初期化
        this.totals = [];
        for (let data of kakeibos) {
          const month = moment(data.date).format("M");
          const category = data.category;
          if (!this.totals[month]) {
            this.totals[month] = new Object();
          }
          if (category in this.totals[month]) {
            this.totals[month][category] += data.price;
          } else {
            this.totals[month][category] = data.price;
          }
        }
      } catch (e) {
        this.showMsg("データの取得に失敗しました。", ERROR_MESSAGE);
        this.slackNotices("Err: " + JSON.stringify(e));
      }
    },

    /**
     * 評価送信
     */
    sendHyouka(message) {
      if (!message) {
        this.showMsg(
          "評価を入力してから送信ボタンを押してください。",
          ERROR_MESSAGE
        );
        return;
      }
      this.slackNotices(message);
      this.showMsg("送信が完了しました、ありがとうございました。");
      this.isConfirm = false;
      this.modalOff();
    },

    /**
     * Slack通知するだけ
     * バックエンド側でやるべき処理な気がする
     * ポートフォリオなのでフロントにしれっと忍ばせるお手軽実装
     */
    async slackNotices(message) {
      const URL =
        "httpxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
      const options = {
        method: "post",
        baseURL: URL,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        data:
          `payload={"text":"<@user_id> \\` + JSON.stringify(message) + `}`,
      };
      const res = axios.request(options);
    },

    /**
     * ユーザー通知
     * */
    async showMsg(msg, type = MESSAGE) {
      this.Msg = msg;
      this.animationMsg = type;

      // 表示されたメッセージを遅延で戻す、もっといいやり方あったけどとりあえず
      await new Promise(function (resolve) {
        setTimeout(resolve, 5000);
      });
      this.Msg = "";
      this.animationMsg = "none";
    },

    /**
     * ページ離れる際の確認
     */
    confirmSave(event) {
      // 何か入力中だったら
      if (this.displayForm != "none") {
        event.returnValue = "編集中のものは保存されませんが、よろしいですか？";
      }
    },
  },
  computed: {
    // 今月分の支出を計算
    toMonthTotal: function () {
      let ret = 0;
      let toMonthData = this.totals[this.toMonth];
      for (let key in toMonthData) {
        if (toMonthData.hasOwnProperty(key)) {
          ret += Number(toMonthData[key]);
        }
      }
      return ret;
    },

    // グラフのデータ
    barData() {
      // グラフ用のデータをライブラリに食わせられるように整形する
      let labels = [];
      let datasets = [];
      let i = 0; // 集計時に何月の集計かをインデックス指定用
      // とりあえず8色、色の自動生成は諸説なので足りなくなったら1色目に戻るでいいと思う
      const color = [
        "rgba(153, 102, 255, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(253, 159, 225, 1)",
        "rgba(187, 187, 187, 1)",
      ];

      // 事前に取得したデータを集計にかける
      this.totals.forEach(function (categoryPrices, month) {
        labels.push(month + "月");
        for (let cat in categoryPrices) {
          // まだ詰めてないカテゴリーは初期化
          if (![...datasets].some((s) => s.label === cat)) {
            const temp = {
              label: cat,
              // 整形しやすいように長さ決めておく(BACK_MONTHになる)
              // & 初期値 0 を入れておかないと足し算する際にNaNになる
              data: new Array(BACK_MONTH).fill(0),
              // 色が足らんくなったら1色目から再利用する(それぞれの長さで余剰値をセレクタに)
              backgroundColor: color[datasets.length % color.length],
            };
            // 家賃、公共料金は積み上げグラフの下に表示したいので先頭に詰める
            if (cat === "家賃" || cat === "公共料金") {
              datasets.unshift(temp);
            } else {
              datasets.push(temp);
            }
          }

          // 集計したデータを詰める
          [...datasets].find((d) => d.label === cat).data[i] +=
            categoryPrices[cat];
        }
        i++;
      });

      return {
        type: "bar",
        labels,
        datasets,
      };
    },
    barOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "x",
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
        },
      };
    },
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  },
};
</script>
