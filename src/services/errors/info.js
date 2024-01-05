export const generateProductErrorInfoMissing =(item)=>{
    let response = `The following fields are missing: `
    if(!item.title){response = response + `title `}
    if(!item.description){response = response + `description `}
    if(!item.code){response = response + `code `}
    if(!item.price){response = response + `price `}

    if(!item.stock){response = response + `stock `}
    if(!item.category){response = response + `category `}

    return response
}
