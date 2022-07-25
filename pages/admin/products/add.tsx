import { useContext, useReducer, useRef, useState } from 'react'
import PrivateRoute from '../../../components/PrivateRoute'
import styles from '../../styles/manageProduct.module.css'
import Head from 'next/head'
import { AuthContext } from '../../../contexts/AuthContext'
import { useRouter } from 'next/router'
import { ModalContext } from '../../../contexts/ModalContext'
const INITIAL_FORM_DATA = {
    name: "",
    description: "",
    prize: "0",
    mdDescription: ""
}
interface formI {
    name: string,
    description: string,
    prize: string,
    mdDescription: string
}
enum FormActions {
    name = "Update_Name",
    description = "Update_Description",
    prize = "Update_Prize",
    mdDescription = "Update_MD_Description",
    file = "Update_file"
}
const Add = () => {
    // Next hooks
    const router = useRouter();
    // Contexts
    const { accessToken } = useContext(AuthContext);
    const { addMessage } = useContext(ModalContext);
    // states
    const [fileName, setFile] = useState("");
    // refs
    const descriptionRef = useRef(null);
    const nameRef = useRef(null);
    const prizeRef = useRef(null);
    const fileRef = useRef(null);
    const formReducer = (lastState: formI, { actionName, value, event }: { actionName: string, value: string, event?: any }) => {
        switch (actionName) {
            case FormActions.name:
                if (value.length >= 32) {
                    nameRef.current.value = lastState.name;
                    return lastState;
                }
                lastState.name = value;
                return lastState;
            case FormActions.description:
                if (value.length >= 64) {
                    descriptionRef.current.value = lastState.description;
                    return lastState;
                }
                lastState.description = value;
                return lastState;
            case FormActions.prize:
                if (isNaN(value)) {
                    prizeRef.current.value = lastState.prize;
                    return lastState;
                }
                if (value.length > 1 && value[0] == "0" && value[1] !== "." || value.includes(" ")) {
                    prizeRef.current.value = lastState.prize;
                    return lastState;
                }
                lastState.prize = value;
                return lastState;
            case FormActions.mdDescription:
                lastState.mdDescription = value;
                return lastState;
            case FormActions.file:
                if (value.split("\\").length === 0) {
                    return lastState;
                }
                const fileName = value.split("\\")[value.split("\\").length - 1];
                if (fileName.endsWith(".jpeg") || fileName.endsWith(".png")) {
                    setFile(fileName);
                    return lastState;
                }
                event.target.value = null;
                setFile("");
                return lastState;
            default:
                throw new Error("Unexpected action name");
        }
    }
    const [formValues, changeFormValue] = useReducer(formReducer, INITIAL_FORM_DATA);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formValues.name) {
            console.log("No name");
            return;
        }
        if (!+formValues.prize) {
            console.log("Invalid prize");
        }
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("description", formValues.description);
        formData.append("prize", formValues.prize);
        formData.append("img", fileRef.current.files[0]);
        formData.append("MD_Description", formValues.mdDescription);

        fetch("/api/products/add/", {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(async (response) => {
            if (response.status !== 201) {
                throw response.json()
            }
            const { data } = await response.json();
            router.replace(`/product/${data}`);
        }).catch(err => {
            addMessage({
                title: "Error occured",
                message: "Cannot save product in database.",
                hideAfter: 8 * 1000,
                type: "ERR"
            })
            console.error(err);
        });
    }

    return (
        <PrivateRoute adminOnly redirect='/'>
            <Head>
                <title>Shopee - New product</title>
            </Head>
            <div className={styles.addContainer + ' navbarFix'}>
                <h1>Add product</h1>
                <form onSubmit={handleFormSubmit} className={styles.addForm}>
                    <label htmlFor="productName">Product name</label>
                    <input
                        ref={nameRef}
                        onChange={
                            (e) => changeFormValue({ actionName: FormActions.name, value: e.target.value })
                        } type="text" id='productName' maxLength={32} name="productName" placeholder='Phone X' />
                    <label htmlFor="productDescription">Description</label>
                    <input
                        ref={descriptionRef}
                        onChange={
                            (e) => changeFormValue({ actionName: FormActions.description, value: e.target.value })
                        } type="text" maxLength={64} name="productDescription" placeholder="Ultra powerful 5G phone" />
                    <label htmlFor="productPrize">Prize</label>
                    <input
                        ref={prizeRef}
                        onChange={
                            (e) => changeFormValue({ actionName: FormActions.prize, value: e.target.value })
                        } type="text" id="productPrize" name="productPrize" placeholder='$ 0' />
                    <label htmlFor="productImages">Image</label>
                    <div className={styles.imagesUpload}>
                        <div className={styles.imageUploadText}>
                            {fileName ?
                                <>
                                    <span className='material-icons'>image</span>
                                    <h2>{fileName}</h2>
                                    <h3>or</h3>
                                    <h2 className={styles.uploadFilesHref}>Browse files</h2>
                                </>
                                :
                                <>
                                    <span className='material-icons'>add_a_photo</span>
                                    <h2>Drag and Drop here</h2>
                                    <h3>or</h3>
                                    <h2 className={styles.uploadFilesHref}>Browse files</h2>
                                </>
                            }
                        </div>
                        <input ref={fileRef} onChange={(e) => changeFormValue({ actionName: FormActions.file, value: e.target.value, event: e })} type="file" name='productImages' id="productImages" accept="image/png, image/jpeg" />
                    </div>
                    <label htmlFor="productDescriptionMD">Markdown Description</label>
                    <textarea
                        onChange={
                            (e) => changeFormValue({ actionName: FormActions.mdDescription, value: e.target.value })
                        } name="productDescriptionMD" id="productDescriptionMD" className={styles.descriptionMD}></textarea>
                    <input className={styles.addProductBTN} type="submit" value="Add Product" id='productSubmit' />
                </form>
            </div>
        </PrivateRoute>
    )
}

export default Add