const jsonDataLobbies = [
   {
      "id": 1,
      "name": "Lobby-0",
      "ownerId": 0,
      "players": [
          {
              "id": 0,
              "name": "Player-0",
              "ready": false,
              "team": 0
          },
          {
            "id": 1,
            "name": "Player-2",
            "ready": false,
            "team": 0
        },

      ],
      "visibility": "Lobby-1",
      "gameMode": "TWO_VS_TWO",
      "gameType": "UNRANKED",
      "invitationCode": "FakeCode00"
  },
  {
   "id": 2,
   "name": "Lobby-1",
   "ownerId": 0,
   "players": [
       {
           "id": 0,
           "name": "Player-0",
           "ready": false,
           "team": 0
       }
   ],
   "visibility": "PUBLIC",
   "gameMode": "ONE_VS_ONE",
   "gameType": "UNRANKED",
   "invitationCode": "FakeCode01"
},
     {
      "id": 3,
      "name": "Lobby-2",
      "ownerId": 0,
      "players": [
          {
              "id": 0,
              "name": "Player-0",
              "ready": false,
              "team": 0
          }
      ],
      "visibility": "PUBLIC",
      "gameMode": "ONE_VS_ONE",
      "gameType": "UNRANKED",
      "invitationCode": "FakeCode02"
  }
];

  export default jsonDataLobbies;