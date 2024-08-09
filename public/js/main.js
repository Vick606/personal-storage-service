document.addEventListener('DOMContentLoaded', () => {
    const newFolderBtn = document.getElementById('newFolderBtn');
    if (newFolderBtn) {
        newFolderBtn.addEventListener('click', () => {
            const folderName = prompt('Enter folder name:');
            if (folderName) {
                fetch('/folders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: folderName }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        window.location.reload();
                    }
                });
            }
        });
    }

    const deleteFileBtns = document.querySelectorAll('.deleteFileBtn');
    deleteFileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const fileId = btn.dataset.fileId;
            if (confirm('Are you sure you want to delete this file?')) {
                fetch(`/files/${fileId}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'File deleted successfully') {
                        btn.closest('li').remove();
                    }
                });
            }
        });
    });
});