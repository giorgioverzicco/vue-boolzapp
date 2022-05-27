var DateTime = luxon.DateTime;

const app = new Vue({
  el: "#app",
  data: {
    replyTimeoutId: null,
    currentContactObj: null,
    newMessage: "",
    searchText: "",
    notificationClosed: false,
    editMode: false,
    darkMode: false,
    user: {
      name: "Sofia",
      avatar: "_io",
    },
    contacts: [
      {
        name: "Michele",
        avatar: "_1",
        visible: true,
        messages: [
          {
            date: "10/01/2020 15:30:55",
            message: "Hai portato a spasso il cane?",
            status: "sent",
          },
          {
            date: "10/01/2020 15:50:00",
            message: "Ricordati di stendere i panni",
            status: "sent",
          },
          {
            date: "10/01/2020 16:15:22",
            message: "Tutto fatto!",
            status: "received",
          },
        ],
      },
      {
        name: "Fabio",
        avatar: "_2",
        visible: true,
        messages: [
          {
            date: "20/03/2020 16:30:00",
            message: "Ciao come stai?",
            status: "sent",
          },
          {
            date: "20/03/2020 16:30:55",
            message: "Bene grazie! Stasera ci vediamo?",
            status: "received",
          },
          {
            date: "20/03/2020 16:35:00",
            message: "Mi piacerebbe ma devo andare a fare la spesa.",
            status: "sent",
          },
        ],
      },
      {
        name: "Samuele",
        avatar: "_3",
        visible: true,
        messages: [
          {
            date: "28/03/2020 10:10:40",
            message: "La Marianna va in campagna",
            status: "received",
          },
          {
            date: "28/03/2020 10:20:10",
            message: "Sicuro di non aver sbagliato chat?",
            status: "sent",
          },
          {
            date: "28/03/2020 16:15:22",
            message: "Ah scusa!",
            status: "received",
          },
        ],
      },
      {
        name: "Alessandro B.",
        avatar: "_4",
        visible: true,
        messages: [
          {
            date: "10/01/2020 15:30:55",
            message: "Lo sai che ha aperto una nuova pizzeria?",
            status: "sent",
          },
          {
            date: "10/01/2020 15:50:00",
            message: "Si, ma preferirei andare al cinema",
            status: "received",
          },
        ],
      },
      {
        name: "Alessandro L.",
        avatar: "_5",
        visible: true,
        messages: [
          {
            date: "10/01/2020 15:30:55",
            message: "Ricordati di chiamare la nonna",
            status: "sent",
          },
          {
            date: "10/01/2020 15:50:00",
            message: "Va bene, stasera la sento",
            status: "received",
          },
        ],
      },
      {
        name: "Claudia",
        avatar: "_6",
        visible: true,
        messages: [
          {
            date: "10/01/2020 15:30:55",
            message: "Ciao Claudia, hai novità?",
            status: "sent",
          },
          {
            date: "10/01/2020 15:50:00",
            message: "Non ancora",
            status: "received",
          },
          {
            date: "10/01/2020 15:51:00",
            message: "Nessuna nuova, buona nuova",
            status: "sent",
          },
        ],
      },
      {
        name: "Federico",
        avatar: "_7",
        visible: true,
        messages: [
          {
            date: "10/01/2020 15:30:55",
            message: "Fai gli auguri a Martina che è il suo compleanno!",
            status: "sent",
          },
          {
            date: "10/01/2020 15:50:00",
            message: "Grazie per avermelo ricordato, le scrivo subito!",
            status: "received",
          },
        ],
      },
      {
        name: "Davide",
        avatar: "_8",
        visible: true,
        messages: [
          {
            date: "10/01/2020 15:30:55",
            message: "Ciao, andiamo a mangiare la pizza stasera?",
            status: "received",
          },
          {
            date: "10/01/2020 15:50:00",
            message: "No, l'ho già mangiata ieri, ordiniamo sushi!",
            status: "sent",
          },
          {
            date: "10/01/2020 15:51:00",
            message: "OK!!",
            status: "received",
          },
        ],
      },
    ],
  },
  computed: {
    filteredContacts() {
      if (!this.searchText) {
        this.contacts.sort((a, b) => {
          const nullDate = "01/01/1980 00:00:00";
          const rawDateA = a.messages.at(-1)?.date || nullDate;
          const rawDateB = b.messages.at(-1)?.date || nullDate;

          const dateA = this.getFormatDate(rawDateA);
          const dateB = this.getFormatDate(rawDateB);

          const diffA = DateTime.now().diff(dateA, "seconds").seconds;
          const diffB = DateTime.now().diff(dateB, "seconds").seconds;

          return diffA - diffB;
        });
      }

      this.searchText = this.searchText.toLowerCase();
      return this.contacts.filter((c) => c.name.toLowerCase().includes(this.searchText));
    },
    currentContact() {
      return this.currentContactObj || this.contacts[0];
    },
  },
  methods: {
    getImage(obj) {
      return `img/avatar${obj.avatar}.jpg`;
    },
    getFormatDate(date) {
      return DateTime.fromFormat(date, "dd/MM/yyyy HH:mm:ss");
    },
    getMessageHour(message) {
      return this.getFormatDate(message.date).toFormat("HH:mm");
    },
    getLastMessageText(contact) {
      const message = contact.messages.at(-1);
      if (!message) return "";

      return message.status === "sent" ? `Tu: ${message.message}` : message.message;
    },
    getLastAccess(contact) {
      const lastMessage = contact.messages.filter((m) => m.status === "received").at(-1);
      if (!lastMessage) return "";

      const rawDate = lastMessage.date;
      const date = this.getFormatDate(rawDate);
      const diff = DateTime.now().diff(date, "days");
      const relativeDate = date.toRelativeCalendar();

      if (diff.days < 1) {
        return `${relativeDate} alle ${date.toFormat("HH:mm")}`;
      }

      return relativeDate;
    },
    getLastMessageHour(contact) {
      const lastMessage = contact.messages.at(-1);
      if (!lastMessage) return "";

      const lastDate = this.getFormatDate(lastMessage.date);
      const diff = DateTime.now().diff(lastDate, "days");

      if (diff.days < 1) {
        return this.getMessageHour(lastMessage);
      } else if (diff.days > 1 && diff.days <= 7) {
        return lastDate.toRelativeCalendar();
      }

      return lastDate.toFormat("dd/MM/yyyy");
    },
    getActualDate() {
      return DateTime.now().toFormat("dd/MM/yyyy HH:mm:ss");
    },
    selectContact(contact) {
      this.currentContact.chatHeight = this.$refs.chat.scrollTop;
      this.currentContactObj = contact;
    },
    sendMessage(contact) {
      if (!this.newMessage) return;

      const message = {
        date: this.getActualDate(),
        message: this.newMessage,
        status: "sent",
        menuOpen: false,
      };

      contact.messages.push(message);
      this.newMessage = "";

      contact.chatHeight = this.$refs.chat.scrollHeight;

      this.getReplyFrom(contact);
    },
    getReplyFrom(contact) {
      this.replyTimeoutId = setTimeout(() => {
        const message = {
          date: this.getActualDate(),
          message: "ok ricevuto!",
          status: "received",
          menuOpen: false,
        };

        contact.messages.push(message);
        contact.chatHeight = this.$refs.chat.scrollHeight;
        clearTimeout(this.replyTimeoutId);
      }, 1000);
    },
    openMenu(message) {
      message.menuOpen = !message.menuOpen;
    },
    deleteMessage(index) {
      this.currentContact.messages.splice(index, 1);
    },
    closeNotification() {
      this.notificationClosed = true;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
  },
  created() {
    this.contacts.forEach((c) => {
      Vue.set(c, "chatHeight", 0);
      c.messages.forEach((m) => Vue.set(m, "menuOpen", false));
    });
  },
  updated() {
    this.$refs.chat.scrollTop = this.currentContact.chatHeight;
  },
});
