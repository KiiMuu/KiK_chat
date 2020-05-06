$(document).ready(() => {
    $('#favorite').on('submit', e => {
        e.preventDefault();

        let id = $('#id').val();
        let clubName = $('#club_name').val();

        $.ajax({
            url: '/clubs',
            type: 'POST',
            data: {
                id,
                clubName
            },
            success: () => {
                console.log(clubName);
            }
        });
    });
});