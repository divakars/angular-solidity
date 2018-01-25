module.exports = {
    networks: {
         development: {
              host: "localhost",
              port: 8545,
              network_id: "15" ,// Match any network id
              from: "0xf192d7eaf60b8d16e31bf3098b8e599c90073dfd",
              gas: 4712388// 6700000
            }//,
        /*  infura: {
               host: "https://rinkeby.infura.io/TrDfxWjmBq2W7KmHve5e",
               network_id: 4, // Match any network
               from: "0x96D17f676a0Ec53EF11B84C3cf6604AC12363F69",
               gas:220000
             },
           rinkeby: {
                host: "localhost",
                port: 8545,
                network_id: 4, // Match any network
                from: "0x96D17f676a0Ec53EF11B84C3cf6604AC12363F69",
                gas:6700000
              }*/
       }
};
