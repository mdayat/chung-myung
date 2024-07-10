const subtestsDummyData = [
  {
    id: "083e1323-8193-4caa-87d3-0dbe278d6ea4",
    name: "Subtest 2",
    sequenceNumber: 2,
  },
  {
    id: "d9d0d96e-4f41-43ef-b0a9-80e6945a777e",
    name: "Subtest 1",
    sequenceNumber: 1,
  },
];

const questionsDummyData = [
  // subtest 1
  {
    id: "1fc3c5ef-17d1-4f0f-b67c-747427cec573",
    content: JSON.stringify([
      { insert: "Gandalf " },
      {
        insert: {
          formula: "c = \\pm\\sqrt{a^2 + b^2}",
        },
      },
      {
        insert: "\n",
      },
      {
        insert: {
          image:
            "https://images.unsplash.com/photo-1606333259737-6da197890fa2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      },
    ]),
    multipleChoice: [
      {
        id: "d287f83b-2e0a-4423-a4a7-6f8acf845386",
        isCorrectAnswer: false,
        content: JSON.stringify([
          {
            insert: {
              image:
                "https://images.unsplash.com/photo-1606333259737-6da197890fa2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          },
        ]),
      },
      {
        id: "70758414-1c01-4a65-b849-5dfe24bd41d4",
        isCorrectAnswer: false,
        content: JSON.stringify([{ insert: "Gandalf " }]),
      },
      {
        id: "ccae100b-ddf9-421f-aaf9-5ccb23c24f19",
        isCorrectAnswer: true,
        content: JSON.stringify([
          {
            insert: {
              formula: "c = \\pm\\sqrt{a^2 + b^2}",
            },
          },
        ]),
      },
    ],
  },

  // subtest 1
  {
    id: "015a6866-8a68-4eaa-861d-a17426775ede",
    content: JSON.stringify([
      { insert: "Oyakatasama " },
      {
        insert: {
          formula: "c = \\pm\\sqrt{a^2 + b^2}",
        },
      },
      {
        insert: "\n",
      },
      {
        insert: {
          image:
            "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      },
    ]),
    multipleChoice: [
      {
        id: "c6a63078-b3a9-4b89-9b04-52e072aa98f4",
        isCorrectAnswer: true,
        content: JSON.stringify([
          {
            insert: {
              image:
                "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          },
        ]),
      },
      {
        id: "5777b86e-14a5-4752-a7ed-ad64599b1296",
        isCorrectAnswer: false,
        content: JSON.stringify([{ insert: "Oyakatasama " }]),
      },
      {
        id: "9ca89392-f5c1-4cf4-9603-5bfdb7ee1bf4",
        isCorrectAnswer: false,
        content: JSON.stringify([
          {
            insert: {
              formula: "c = \\pm\\sqrt{a^2 + b^2}",
            },
          },
        ]),
      },
    ],
  },

  // subtest 2
  {
    id: "974823db-5bc6-4833-9537-266a930f25d4",
    content: JSON.stringify([
      { insert: "Giyu san " },
      {
        insert: {
          formula: "c = \\pm\\sqrt{a^2 + b^2}",
        },
      },
      {
        insert: "\n",
      },
      {
        insert: {
          image:
            "https://plus.unsplash.com/premium_photo-1661580623387-5b1abd14484f?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      },
    ]),
    multipleChoice: [
      {
        id: "562eabd8-d41f-4c73-915b-10dd37798402",
        isCorrectAnswer: true,
        content: JSON.stringify([
          {
            insert: {
              image:
                "https://plus.unsplash.com/premium_photo-1661580623387-5b1abd14484f?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            },
          },
        ]),
      },
      {
        id: "8b5273d5-25b4-4451-bd24-c392d611b99f",
        isCorrectAnswer: false,
        content: JSON.stringify([{ insert: "Giyu san " }]),
      },
      {
        id: "11fbea80-1a28-4537-a606-83501bd785f6",
        isCorrectAnswer: false,
        content: JSON.stringify([
          {
            insert: {
              formula: "c = \\pm\\sqrt{a^2 + b^2}",
            },
          },
        ]),
      },
    ],
  },

  // subtest 2
  {
    id: "ffb79740-c581-4f7d-927b-3b0ff990eb26",
    content: JSON.stringify([
      { insert: "Inosuke dono " },
      {
        insert: {
          formula: "c = \\pm\\sqrt{a^2 + b^2}",
        },
      },
      {
        insert: "\n",
      },
      {
        insert: {
          image: "https://restaurant-api.dicoding.dev/images/medium/25",
        },
      },
    ]),
    multipleChoice: [
      {
        id: "e886a46a-bd39-4731-8dc7-9232ff75008a",
        isCorrectAnswer: true,
        content: JSON.stringify([
          {
            insert: {
              image: "https://restaurant-api.dicoding.dev/images/medium/25",
            },
          },
        ]),
      },
      {
        id: "0d0ddc67-86c6-4658-98d2-f701018cbf29",
        isCorrectAnswer: false,
        content: JSON.stringify([{ insert: "Inosuke dono " }]),
      },
      {
        id: "fb6f6c3d-6e21-42a9-8b31-6213fba5c016",
        isCorrectAnswer: false,
        content: JSON.stringify([
          {
            insert: {
              formula: "c = \\pm\\sqrt{a^2 + b^2}",
            },
          },
        ]),
      },
    ],
  },
];

export { subtestsDummyData, questionsDummyData };