import supertest from 'supertest';
import chai from 'chai'


const expect = chai.expect;
const requester = supertest('http://localhost:8080')

const newUser = {
    first_name: 'tester',
    last_name: "tester",
    age: 18,
    email: 'newTester@mail.com',
    password: 'coder123'
}

let cookie

describe('Testing Router Sessions', () => {
    describe('Session Test', () => {
        beforeEach(async function () {
            this.timeout(5000)
        })
        
        it('the endpoint POST /api/sessions/register must create a user correctly', async function () {
            const response = await requester.post('/api/sessions/register').send(newUser)
            expect(response.status).to.equal(200);
        })
        
        it('the enpoint POST /api/sessions/login must login a user correctly and return a cookie', async function () {
            const response = await requester.post('/api/sessions/login').send(newUser)
            const cookieResult = response.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok;
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.eql('coderCookieToken');
            expect(cookie.value).to.be.ok
        })
        
        it('the endpoint GET /api/sessions/current must return the user that contains the cookie', async function () {
            const response = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(response.body.payload.email).to.be.eql(newUser.email);
        })
    })

})