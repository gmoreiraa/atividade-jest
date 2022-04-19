const request = require('supertest')
const app = require('../src/app')
const animalsData = require('../src/data/animals.json')
const fs = require('fs')

describe('Cadastro de animais', () => {
    afterAll(() => {
        while (animalsData.length > 0) {
            animalsData.pop()
        }
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData))        
    });

    it('Deve cadastrar um animal com sucesso', async () => {
        const res = await request(app).post('/animais?nome=Spike&especie=Cachorro&idade=3')
        expect(res.status).toBe(201)
    });

    it('Deve falhar ao tentar cadastrar um animal com idade invalida', async () => {
        const res = await request(app).post('/animais?nome=Mimi&especie=Gato&idade=jovem')
        expect(res.status).toBe(400)
    });

    it('Deve falhar ao tentar cadastrar um animal com nome curto', async () => {
        const res = await request(app).post('/animais?nome=J&especie=Hamster&idade=1')
        expect(res.status).toBe(400)
    });
});

describe('Listar animais', () => {
    beforeAll(() => {
        animalsData.push({
            'nome': 'Bob',
            'especie': 'gato',
            'idade': 1
        })
        animalsData.push({
            'nome': 'Bel',
            'especie': 'cachorro',
            'idade': 2
        })
        animalsData.push({
            'nome': 'Rex',
            'especie': 'cachorro',
            'idade': 3
        })

        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData))        
    });

    afterAll(() => {
        while (animalsData.length > 0) {
            animalsData.pop()
        }
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData))        
    });

    it('Deve listar os animais cadastrados', async () => {
        const res = await request(app).get('/animais')
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(3)
    });
});