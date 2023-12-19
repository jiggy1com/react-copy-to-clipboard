import {MongoDBService} from "@/services/MongoDBService";

const service = new MongoDBService();

// TESTING ONLY
// OK TO DELETE OR UPDATE

export default async (req, res) => {

    let title = req.body.title ?? 'welcome'

    service.createBoard(title).then(() => {

    })
    service.readBoard().then((resp) => {
        res.json(resp);
    });
    // try {
    //     const client = await clientPromise;
    //     const db = client.db(DB);
    //
    //     const test = await db
    //         .collection("test")
    //         .find({})
    //         .sort({ metacritic: -1 })
    //         .limit(10)
    //         .toArray();
    //
    //     res.json(test);
    // } catch (e) {
    //     console.error(e);
    // }
};
