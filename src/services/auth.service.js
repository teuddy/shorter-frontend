import http from '../apis'
import { history } from '../helpers'

export async function registerUser(
  values,
  { props, setSubmitting, setValues, setErrors }
) {
  // Disable submit button
  setSubmitting(true)

  try {
    const { data } = await http.post('/auth/register', {
      name: values.name,
      email: values.email,
      password: values.password
    })
    setValues({
      ...values,
      message: `Please check your email ${data.email} to activate your account`
    })
  } catch (error) {
    // Remove user information from redux store
    props.onLogout()

    // Check if error object has a response from server
    if (!error.response) {
      setValues({
        ...values,
        message: 'Service temporarily unavailable'
      })
      return
    }
    const { status } = error.response
    if (status === 409) {
      setErrors({
        email: 'Email already used'
      })
    }
  } finally {
    // Enable submit button
    setSubmitting(false)
  }
}

export async function loginUser(
  values,
  { props, setSubmitting, setValues, setErrors }
) {
  // Disable submit button
  setSubmitting(true)

  try {
    // Send credentials and wait for server's response
    const response = await http.post('/auth/login', {
      email: values.email,
      password: values.password
    })
    // Extract data from server's response
    const { data } = response

    // Store accessToken redux store
    props.onLogin(data.accessToken)

    // Show success message
    setValues({
      ...values,
      message: 'Welcome back, you will be redirected to your dashboard'
    })

    // Redirect user to his dashboard
    setTimeout(() => {
      history.push('/dashboard')
    }, 1500)
  } catch (error) {
    // Remove user information from redux store
    props.onLogout()

    // Check if error object has a response from server
    if (!error.response) {
      setValues({
        ...values,
        message: 'Service temporarily unavailable'
      })
      return
    }
    const { message } = error.response.data
    setValues({
      ...values,
      message
    })
  } finally {
    // Enable submit button
    setSubmitting(false)
  }
}
