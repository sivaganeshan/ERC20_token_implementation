

const Inrs = artifacts.require('inrs');

contract("inrs", (accounts)=>{

    before(async () =>{
        inrs = await Inrs.deployed();
    })

    it("the owner of the token receives 21 Million tokens", async()=>{
        let tokenBalance = await inrs.balanceOf(accounts[0]);
       // console.log(`account : ${accounts[0]} and its INRS balance : ${web3.utils.fromWei(tokenBalance, 'ether')}`);
        assert.equal("1000000", web3.utils.fromWei(tokenBalance, 'ether'));
    })

    it("the name of Erc20 is INRSToken",async ()=>{
        let tokenName = await inrs.name();
        assert.equal(tokenName, "INRSToken");
    })

    it("verify the total supply", async ()=>{
        let totalSupply = await inrs.totalSupply();
        assert.equal("1000000", web3.utils.fromWei(totalSupply, "ether"));
    })

    it("the decimals of created token should be 18", async () =>{
        let decimals = await inrs.decimals();
        assert.equal(decimals, "18");
    })

    it("transfer from owner to investor and verify the transfer", async()=>{

        let amount = web3.utils.toWei("100", 'ether');
        
        await inrs.transfer(accounts[1], web3.utils.toBN(amount), {from : accounts[0]});

        let ownerBalance = await inrs.balanceOf(accounts[0]);
        let investorBalance = await inrs.balanceOf(accounts[1]);

        assert.equal("999900", web3.utils.fromWei(web3.utils.toBN(ownerBalance), "ether")); 
        assert.equal("100", web3.utils.fromWei(web3.utils.toBN(investorBalance), "ether"));
    })

    it("verify the admin", async()=>{

        let admin = await inrs.admin();
        assert.equal(admin, accounts[0]);
    })

    it("only admins can mint token post intial deployment", async()=>{
       
         //Minting from account 1
         try{
             await inrs.mint(accounts[1], (web3.utils.toWei("100", "ether")), {from:accounts[1]});
         }
         catch(Ex){
             console.log(Ex.message);
         }
         
         let initialTotalSupply = await inrs.totalSupply();
         //Minting from account 0
         await inrs.mint(accounts[1], web3.utils.toWei("100", "ether").toString(), {from:accounts[0]});
         let currentTotalSupplyFromAdmin = await inrs.totalSupply();
         //current supply is greater than intial supply
         assert.equal(web3.utils.toBN(initialTotalSupply) < web3.utils.toBN(currentTotalSupplyFromAdmin), true);
         //verifying the actual totalsupply
         assert.equal(currentTotalSupplyFromAdmin , web3.utils.toWei("1000100","ether"));

    })

    it("burn 50 token from investor", async()=>{

        let amount = web3.utils.toWei("100", 'ether');
        
        await inrs.transfer(accounts[1], web3.utils.toBN(amount), {from : accounts[0]});

        let initialOwnerBalance = await inrs.balanceOf(accounts[0]);
        let initialInvestorBalance = await inrs.balanceOf(accounts[1]);

        assert.equal("999800", web3.utils.fromWei(web3.utils.toBN(initialOwnerBalance), "ether")); 
        assert.equal("300", web3.utils.fromWei(web3.utils.toBN(initialInvestorBalance), "ether"));

        //burn token
        await inrs.burn(web3.utils.toWei("50", 'ether'), {from:accounts[1]});
        //investor balance post burn
        let investorBalancePostBurn = await inrs.balanceOf(accounts[1]);
        assert.equal("250", web3.utils.fromWei(web3.utils.toBN(investorBalancePostBurn), "ether"));

        //Verify Burn address balance
        // let burnAddressBalance = await inrs.balanceOf('0x0000000000000000000000000000000000000000');
        // assert.equal("50", web3.utils.fromWei(web3.utils.toBN(burnAddressBalance), "ether"));


    })

    
    
})