const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_full_stack')

const Album = sequelize.define('album', {
    title: Sequelize.STRING,
});

const Artist = sequelize.define('artist', {
    name: Sequelize.STRING
});

Artist.hasMany(Album);
Album.belongsTo(Artist);

const playlist = [
    {title: 'Red'},
    {title: 'Views'},
    {title: 'Dawn FM'},
    {title: 'The Blueprint'},
    {title: 'Nevermind'},
]
Album.addAlbum = function() {
    let outputAlbum = playlist.pop();
    return this.create(outputAlbum);
}

const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

const init = async()=> {
    try {
      await sequelize.sync({ force: true });
      await Promise.all([
        Album.create({title: 'Red'}),
        Album.create({title: 'Views'}),
        Album.create({title: 'Dawn FM'}),
    ]);
  
      await Artist.create({ name: 'Drake' });
      await Artist.create({ name: 'The Weeknd' });
      await Artist.create({ name: 'Taylor Swift' });
  
      const port = process.env.PORT || 3000;
      app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(ex){
      console.log(ex);
    }
  };

init();