import * as Yup from "yup"

// eslint-disable-next-line 
let EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const collaboratorSchema = Yup.object({
    email: Yup.string().matches(EMAIL_REGX,"This email isn’t valid")
})