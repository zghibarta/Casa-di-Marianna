"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Mail, MapPin, Send } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: "general",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(false)
    setSubmitSuccess(false)

    try {
      // Pregătim datele pentru Web3Forms
      const formDataToSend = new FormData()
      formDataToSend.append("access_key", "37a938ea-444c-4714-925d-83323ad98fd3")
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone || "Nu a fost furnizat")
      formDataToSend.append("message", formData.message)
      formDataToSend.append("service", formData.service)
      formDataToSend.append("subject", `Mesaj nou de la ${formData.name} - ${formData.service}`)

      // Adăugăm câmpul de captcha (opțional)
      formDataToSend.append("from_name", "Casa di Marianna Website")

      // Trimitem datele către Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        // Resetăm formularul după trimiterea cu succes
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          service: "general",
        })
        setSubmitSuccess(true)

        // Resetăm mesajul de succes după 5 secunde
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      } else {
        throw new Error(data.message || "A apărut o eroare la trimiterea formularului")
      }
    } catch (error) {
      console.error("Eroare la trimiterea formularului:", error)
      setSubmitError(true)
      setErrorMessage(error instanceof Error ? error.message : "A apărut o eroare la trimiterea mesajului")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contactează-ne</h2>
            <p className="text-gray-600 mb-8">
              Suntem aici pentru a răspunde întrebărilor tale și pentru a te ajuta să începi călătoria către un corp
              sănătos și o viață echilibrată.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#A7C7E7]/10 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-[#A7C7E7]" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Telefon</h3>
                  <p className="text-gray-600">+373 79668884</p>
                  <p className="text-gray-600">Luni-Vineri: 9:00-18:00</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#A7C7E7]/10 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-[#A7C7E7]" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Email</h3>
                  <p className="text-gray-600">info@casadimarianna.com</p>
                  <p className="text-gray-600">Răspundem în maxim 24 de ore</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#A7C7E7]/10 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-[#A7C7E7]" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Adresă</h3>
                  <p className="text-gray-600">Str. Braniștii 7/1, Chișinău</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Trimite-ne un mesaj</h3>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                Mesajul tău a fost trimis cu succes! Te vom contacta în curând.
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                {errorMessage || "A apărut o eroare la trimiterea mesajului. Te rugăm să încerci din nou."}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Câmp ascuns pentru cheia de acces Web3Forms */}
              <input type="hidden" name="access_key" value="37a938ea-444c-4714-925d-83323ad98fd3" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nume complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Serviciu de interes
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]"
                  >
                    <option value="general">Informații generale</option>
                    <option value="proceduri">Proceduri de slăbire</option>
                    <option value="nutritie">Consultații nutriționale</option>
                    <option value="consiliere">Consiliere psihologică</option>
                    <option value="produse">Produse și suplimente</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mesaj *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7C7E7]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  "Se trimite..."
                ) : (
                  <>
                    Trimite mesaj <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
