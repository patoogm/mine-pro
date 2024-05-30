const fs = require ("fs");
const jwt = require ("jsonwebtoken")

const addProjects = async (req, res) => {
    try {

        const data = await fs.readFileSync('./userData.json','utf8');
        const json = JSON.parse(data);

        json.push(req.body);

        await fs.writeFileSync('userData.json', JSON.stringify(json));
    
        res.send('Objeto agregado al archivo JSON correctamente');
      } catch (error) {
        console.error('Error al agregar el objeto al archivo JSON:', error);
        res.status(500).send('Error al procesar la solicitud');
      }
}

const deleteUser = async (req, res) => {
  
  try {   
    const idToDelete = req.params?.id;
    const data = await fs.readFileSync('./userData.json', 'utf8');
    const json = JSON.parse(data);
    
    const filteredArray = json.filter(item => item.id !== idToDelete);
    
    if (filteredArray.length !== json.length) {
      await fs.writeFileSync('userData.json', JSON.stringify(filteredArray), 'utf8');
      res.send(`Objeto con ID ${idToDelete} eliminado correctamente`);
    } else {
      res.status(404).send(`No se encontró ningún objeto con ID ${idToDelete}`);
    }
  } catch (error) {
    console.error('Error al eliminar el objeto del archivo JSON:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
}

const editField = async (req, res) => {
  
  try {   
    const fieldToEdit = req.body;
    const idToEdit = req.params?.id;
    const data = await fs.readFileSync('./userData.json', 'utf8');
    const json = JSON.parse(data);
    
    const filteredField = json.map((item) => {
      if (idToEdit !== item.id) return item
      return {
        ...item,
        ...fieldToEdit
      }
    });

    await fs.writeFileSync ('userData.json', JSON.stringify(filteredField), 'utf8');
    res.send('Campo editado correctamente')

  } catch (error) {
    console.error('Error al eliminar el objeto del archivo JSON:', error);
    res.status(500).send('Error al procesar la solicitud');
  }
}

const login = (req, res) => {
  try {
    const logedUser = req.body.user;
    const userPass = req.body.password;
    if (logedUser !== process.env.USER_NAME || userPass !== process.env.USER_PASSWORD) return res.send("Usuario incorrecto")
    jwt.sign({name: logedUser}, process.env.SECRETJWT, {expiresIn: '1h'}, (error,token) => {
      if (error) {
        throw error;
    }
    res.status(200).json({ message: 'Logeo exitoso', token });
    })

  } catch (error) {
    console.error('Error al eliminar el objeto del archivo JSON:', error);
    res.status(500).send('Error al procesar la solicitud')
  }
}

module.exports = {
  addProjects,
  deleteUser,
  editField,
  login
}