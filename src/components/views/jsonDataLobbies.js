const jsonDataLobbies = [
   {
      "id": 1,
      "name": "NewLobby1",
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
      "visibility": "PUBLIC",
      "gameMode": "TWO_VS_TWO",
      "gameType": "UNRANKED",
      "invitationCode": "ABCDEFGH"
  },
  {
   "id": 2,
   "name": "NewLobby2",
   "ownerId": 0,
   "players": [
       {
           "id": 0,
           "name": "Player-0",
           "ready": false,
           "team": 0
       }
   ],
   "visibility": "PRIVATE",
   "gameMode": "ONE_VS_ONE",
   "gameType": "UNRANKED",
   "invitationCode": "AAAAAAAA"
},
     {
      "id": 3,
      "name": "LongerNewLobby3",
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
      "invitationCode": "HANNIBAL"
  }
];

  export default jsonDataLobbies;