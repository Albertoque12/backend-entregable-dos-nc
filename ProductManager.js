const fs = require('fs')


/// Productos



const libro = {title: 'El principito', 
description: 'Para niños', 
price: 250, 
thumbnail: 'image', 
code: 1556, 
stock: 5}

const juguete = {title: 'Pelota', 
description: 'Objeto redondo', 
price: 50, 
thumbnail: 'image2', 
code: 1576, 
stock: 10}

const ropa = {title: 'Playera', 
description: 'Roja', 
price: 200, 
thumbnail: 'image3', 
code: 2454, 
stock: 6}




class ProductManager {
    constructor(filepath) {
        this.filepath = filepath
    }

    async #readFile(){
        try {
            const content = await fs.promises.readFile(this.filepath, "utf-8")
            const parseContent = JSON.parse(content)
            return parseContent
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts(){
        const fileContent = await this.#readFile()
        try {
            if(fileContent.length === 0) throw new Error("Not products found")
            else console.log(fileContent)
        } catch (error) {
            console.log("Not products found")
        }
    }

    async #checkProductCode(code) {
        const fileContent = await this.#readFile()
        return fileContent.find((obj) => obj.code === code)
    }
    
    async addProduct(obj){
        const fileContent = await this.#readFile()
        if (await this.#checkProductCode(obj.code)) return console.log(`Product with code ${obj.code} is already added to the cart`);
        
        try {

            if(fileContent.length !== 0) await fs.promises.writeFile(this.filepath, JSON.stringify([...fileContent, {...obj, id: fileContent[fileContent.length -1].id + 1}], null, 2), 'utf-8')
            else await fs.promises.writeFile(this.filepath, JSON.stringify([{...obj, id: 1}]), 'utf-8')
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id){
        try {
            const fileContent = await this.#readFile()

            if(!fileContent.find((obj) => obj.id === id)) throw new Error (`Product with Id ${obj.id} was not found`)
            else console.log(fileContent.find((obj) => obj.id === id));
        } catch {
            console.log(`Product with Id ${id} was not found`);
        }
    }

    async updateProduct(id, obj) {
        try {
        const fileContent = await this.#readFile()
        const updated = fileContent.map((product) => product.id === id ? {...product, ...obj} : product )
        if (!fileContent.find((obj) => obj.id === id)) throw new Error(`Product with Id ${id} was not found`)
        else await fs.promises.writeFile(this.filepath, JSON.stringify(updated, null, 2))

    } catch (error) {
        console.log(`Product with id ${id} was not found`);
    }
    }

    async deleteProductById(id) {
        try{
        const fileContent = await this.#readFile()
        const productsFiltered = fileContent.filter((product) => product.id !== id)

        if(!fileContent.find((obj) => obj.id === id)) throw new Error(`Product with id ${id} not found`)
        else await fs.promises.writeFile(this.filepath, JSON.stringify(productsFiltered, null, 2))
    
    } catch (error) {
        console.log(error);
    }}
}




const newProductManager = new ProductManager("data/database.json")
//newProductManager.addProduct(libro)
//newProductManager.getProductById(1)
//newProductManager.updateProduct(1, {description: "Objeto esférico"})
newProductManager.deleteProductById(1)

