exports.groupPage = (req, res, next) => {
    const name = req.params.name;

    res.render('groupchat/group', {
        pageTitle: 'Group',
        name
    });
}