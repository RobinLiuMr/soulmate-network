export default function PictureModal({ modalState, closeFuncProps }) {
    function onFormSubmit(event) {
        event.preventDefault();

        fetch("/api/users/profile", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert("Error uploading avatar!");
                    return;
                }

                // onUpload(data);
                console.log("fetch /api/users/profile ", data);
            });
    }

    if (!modalState) {
        return null;
    }

    return (
        <div className="picture_modal">
            <button onClick={closeFuncProps}>X</button>

            <form onSubmit={onFormSubmit}>
                <input type="file"></input>
            </form>
        </div>
    );
}
