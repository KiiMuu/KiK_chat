exports.adminPage = (req, res, next) => {
    res.render('admin/dashboard', {
        pageTitle: 'Dashborad'
    });
}