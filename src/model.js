module.exports = (sequelize, DataTypes) => {
    const Movies = sequelize.define('movies', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        actor1: {
            type: DataTypes.STRING,
            field: 'actor_1'
        },
        actor2: {
            type: DataTypes.STRING,
            field: 'actor_2'
        },
        actor3: {
            type: DataTypes.STRING,
            field: 'actor_3'
        },
        director: {
            type: DataTypes.STRING
        },
        distributor: {
            type: DataTypes.STRING
        },
        funFacts: {
            type: DataTypes.STRING
        },
        locations: {
            type: DataTypes.STRING
        },
        productionCompany: {
            type: DataTypes.STRING,
            field: 'production_company'
        },
        releaseYear: {
            type: DataTypes.INTEGER,
            field: 'release_year' 
        },
        title: {
            type: DataTypes.STRING
        },
        writer: {
            type: DataTypes.STRING
        },
        lat: {
            type: DataTypes.STRING
        },
        lng: {
            type: DataTypes.STRING
        }
    });
    Movies.sync();
    return Movies;
};