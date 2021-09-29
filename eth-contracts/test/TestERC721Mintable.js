var ERC721MintableComplete = artifacts.require('POVToken');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            for (var i = 3;i< 9;i ++) {
                await this.contract.mint(accounts[i], i, "propertytoken");
            }
        })

        it('should return total supply', async function () { 
            var tokensCount = await this.contract.totalSupply();
            assert.equal(tokensCount, 6, "Number of tokens not valid");
        })

        it('should get token balance', async function () { 
            var balance = await this.contract.balanceOf(accounts[3]);
            assert.equal(balance, 1, "account 3 should have 1 token");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            var tokenURI = await this.contract.tokenURI(3);
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(accounts[3], accounts[4], 3, {from: accounts[3]});
            var balance = await this.contract.balanceOf(accounts[4]);
            assert.equal(balance, 2, "accounts 4 should have 2 tokens now.");

            var ownerOfToken = await this.contract.ownerOf(3);
            assert.equal(ownerOfToken, accounts[4], "Account 4 should own token 3 now");
        })
    });


})