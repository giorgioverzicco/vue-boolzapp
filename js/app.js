var DateTime = luxon.DateTime;

const app = new Vue({
  el: "#app",
  data: {
    replyTimeoutId: null,
    currentContactObj: null,
    newMessage: "",
    searchText: "",
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
          const rawDateA = a.messages.at(-1).date;
          const rawDateB = b.messages.at(-1).date;

          const dateA = DateTime.fromFormat(rawDateA, "dd/MM/yyyy HH:mm:ss");
          const dateB = DateTime.fromFormat(rawDateB, "dd/MM/yyyy HH:mm:ss");

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
    getImage(name) {
      return `img/avatar${name}.jpg`;
    },
    getMessageHour(message) {
      return DateTime.fromFormat(message.date, "dd/MM/yyyy HH:mm:ss").toFormat("HH:mm");
    },
    getLastMessageText(contact) {
      const message = contact.messages.at(-1);
      return message.status === "sent" ? `Tu: ${message.message}` : message.message;
    },
    getLastAccess(contact) {
      const rawDate = contact.messages.filter((m) => m.status === "received").at(-1).date;

      const date = DateTime.fromFormat(rawDate, "dd/MM/yyyy HH:mm:ss");
      const diff = DateTime.now().diff(date, "days");
      const relativeDate = date.toRelativeCalendar();

      if (diff.days < 1) {
        return `${relativeDate} alle ${date.toFormat("HH:mm")}`;
      }

      return relativeDate;
    },
    getLastMessageHour(contact) {
      const lastMessage = contact.messages.at(-1);
      const lastDate = DateTime.fromFormat(lastMessage.date, "dd/MM/yyyy HH:mm:ss");
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
      this.currentContactObj = contact;
    },
    sendMessage(contact) {
      if (!this.newMessage) return;

      const message = {
        date: this.getActualDate(),
        message: this.newMessage,
        status: "sent",
      };

      contact.messages.push(message);
      this.newMessage = "";

      this.currentContactObj = contact;

      this.getReplyFrom(contact);
    },
    getReplyFrom(contact) {
      this.replyTimeoutId = setTimeout(() => {
        const message = {
          date: this.getActualDate(),
          message: "ok ricevuto!",
          status: "received",
        };

        contact.messages.push(message);
        clearTimeout(this.replyTimeoutId);
      }, 1000);
    },
  },
});
