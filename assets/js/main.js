// // set dynamic backgournd to nav based on route location
// let navBack = document.getElementById('nav');

// if (location.pathname === '/signup') {
//     navBack.style.background = 'transparent';
// } else {
//     navBack.style.background = '#00B5B5';
// }

$(document).ready(() => {
    $('.upload-btn').on('click', () => {
        $('#upload-input').click();
    });

    $('#upload-input').on('change', () => {
        let uploadInput = $('#upload-input');

        if (uploadInput.val() !== '') {
            let formData = new FormData();

            formData.append('upload', uploadInput[0].files[0]);

            $.ajax({
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: () => {
                    uploadInput.val('')
                }
            });
        }
    });
});