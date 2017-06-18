// display message to viewers
const config = require('./config');

// definition here
class IntroService {
    init(app) {
        // Landing page of SCABER.
        app.get('/', this.index);
    }
    index(req, res) {
        // Define for landing page - parameter here
        res.render('index', {
            title: "SCABER - Your best choice of taxi."
        });
    }
}

module.exports = {
    IntroService: new IntroService()
};