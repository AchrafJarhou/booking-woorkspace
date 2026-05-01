const BaseModel = require('./BaseModel');
const db = require('../config/db');

class Room extends BaseModel {
        static table = 'salles'; // On dit à la classe mère qu'on gère la table 'salles'
    constructor(data) {
        super('salles'); // On dit à la classe mère qu'on gère la table 'salles'
        Object.assign(this, data); // Astuce pour assigner tous les champs d'un coup
    }

    // On réécrit getAll car on a une jointure spécifique (Polymorphisme)
    static async getAll() {
        const sql = `
            SELECT s.*, t.nom as type_nom 
            FROM salles s
            JOIN types t ON s.type_id = t.id
        `;
        const [rows] = await db.execute(sql);
        return rows;
    }
    // On réécrit getById car on a une jointure spécifique (type de salle)
    static async getById(id) {
        const sql = `
            SELECT s.*, t.nom as type_nom 
            FROM salles s
            JOIN types t ON s.type_id = t.id
            WHERE s.id = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
    // recuperer les photos d'une salle
    static async getPhotos(salleId) {
        const [rows] = await db.execute("SELECT url FROM salle_photos WHERE salle_id = ?", [salleId]);
        return rows;
    }

    // La création utilise l'outil getConnection de la classe mère
    static async create(data, photos = []) {
        const connection = await super.getConnection(); 
        try {
            await connection.beginTransaction();

            const sql = `
                INSERT INTO salles 
                (nom, statut, adresse, code_postal, ville, latitude, longitude, capacite, description, prix_heure, prix_demi_journee, prix_journee, image_principale, type_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                data.nom, data.statut, data.adresse, data.code_postal, data.ville, 
                data.latitude, data.longitude, data.capacite, data.description, 
                data.prix_heure, data.prix_demi_journee, data.prix_journee, data.image_principale, data.type_id
            ];

            const [result] = await connection.execute(sql, params);
            const newId = result.insertId;

            if (photos.length > 0) {
                const photoSql = "INSERT INTO salle_photos (salle_id, url) VALUES (?, ?)";
                for (const url of photos) {
                    await connection.execute(photoSql, [newId, url]);
                }
            }

            await connection.commit();
            return newId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getEquipments(roomId) {
        const sql = `
            SELECT e.nom 
            FROM equipements e
            JOIN salle_equipements se ON e.id = se.equipement_id
            WHERE se.salle_id = ?
        `;
        const [rows] = await db.execute(sql, [roomId]);
        return rows;
    }

    // Mise à jour d'une salle (champs optionnels)
    static async update(id, data) {
        const connection = await super.getConnection();
        try {
            const allowedFields = ['nom', 'statut', 'adresse', 'code_postal', 'ville', 'latitude', 'longitude', 'capacite', 'description', 'prix_heure', 'prix_demi_journee', 'prix_journee', 'image_principale', 'type_id'];
            const updates = [];
            const values = [];

            for (const field of allowedFields) {
                if (data[field] !== undefined) {
                    updates.push(`${field} = ?`);
                    values.push(data[field]);
                }
            }

            if (updates.length === 0) {
                return false;
            }

            values.push(id);
            const sql = `UPDATE salles SET ${updates.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute(sql, values);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }
}

module.exports = Room;