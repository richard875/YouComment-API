//const { v4: uuidv4 } = require("uuid");
//console.log(uuidv4());

var api = [
  // This is one video
  {
    videoID: "abc123",
    numberOfComments: 2,
    createdAt: "2020-06-06T02:04:08.153Z",
    review: { likes: 0, dislikes: 0 },
    comments: [
      {
        id: 1,
        createdAt: "2020-07-06T02:04:08.153Z",
        user: { firstName: "Russell", lastName: "Bloxwich" },
        profilePicture:
          "https://scontent.fakl1-2.fna.fbcdn.net/v/t1.0-1/p200x200/42405816_2409305592417947_7123017326986788864_n.jpg?_nc_cat=101&_nc_sid=dbb9e7&_nc_ohc=D1SLwPRsqCcAX_3FObl&_nc_ht=scontent.fakl1-2.fna&_nc_tp=6&oh=0c16ef3f9742e52207c951c1bf5bb867&oe=5F4034ED",
        review: { likes: 0, dislikes: 0 },
        body:
          "I really like this video!<br />This is the best!<br />1<br />2<br />3",
        replies: [
          {
            replyId: 1,
            createdAt: "2020-07-10T02:04:08.153Z",
            user: { firstName: "Russell", lastName: "DM" },
            profilePicture:
              "https://scontent.fakl1-2.fna.fbcdn.net/v/t1.0-1/p200x200/116209451_3815084151853414_4715784425846169697_n.jpg?_nc_cat=106&_nc_sid=dbb9e7&_nc_ohc=NwJujnjkjm4AX_4QKBK&_nc_ht=scontent.fakl1-2.fna&_nc_tp=6&oh=62c704291a3aba9328782845f7660a15&oe=5F3F416C",
            review: { likes: 0, dislikes: 0 },
            body: "Nice video!<br />Good stuff!",
          },
          {
            replyId: 2,
            createdAt: "2020-07-10T02:04:08.153Z",
            user: { firstName: "Jennifer", lastName: "Lawence" },
            profilePicture:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Jennifer_Lawrence_SDCC_2015_X-Men.jpg/440px-Jennifer_Lawrence_SDCC_2015_X-Men.jpg",
            review: { likes: 0, dislikes: 0 },
            body: "1<br />2<br />3<br />4<br />5<br />6",
          },
        ],
      },
      {
        id: 2,
        createdAt: "2020-07-15T02:04:08.153Z",
        user: { firstName: "Justin", lastName: "Bieber" },
        profilePicture:
          "https://www.gannett-cdn.com/presto/2020/01/28/USAT/107a7fa1-22e7-4878-870d-a959c3f78acd-AFP_AFP_1OG6IB.JPG?width=660&height=495&fit=crop&format=pjpg&auto=webp",
        review: { likes: 0, dislikes: 0 },
        body: "Nice!<br />Hiii<br />Yes!",
        replies: [],
      },
    ],
    body: "",
  },
  // -----
];
