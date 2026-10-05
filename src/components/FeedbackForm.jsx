// src/components/FeedbackForm.jsx
import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  // --- Состояния значений полей ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");        // Задание 2
  const [message, setMessage] = useState("");
  const [wantReply, setWantReply] = useState(false); // Задание 3

  // --- Состояние процесса отправки ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Состояние ошибок валидации ---
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    phone: null,
    message: null,
  });

  // --- Состояние "тронутых" полей ---
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  // --- Состояние успешной отправки ---
  const [submitted, setSubmitted] = useState(false);

  // ============ ЗАДАНИЕ 2: маска телефона ============
  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = "7" + digits.slice(1);
    if (digits && !digits.startsWith("7")) digits = "7" + digits;
    digits = digits.slice(0, 11);

    const p = digits;
    if (p.length === 0) return "";
    if (p.length <= 1) return `+${p}`;
    if (p.length <= 4) return `+${p[0]} (${p.slice(1)}`;
    if (p.length <= 7) return `+${p[0]} (${p.slice(1, 4)}) ${p.slice(4)}`;
    if (p.length <= 9)
      return `+${p[0]} (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7)}`;
    return `+${p[0]} (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9, 11)}`;
  };

  // ============ Функции валидации ============
  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim()))
      return "Только буквы, пробелы и дефис";
    return null;
  };

  // ЗАДАНИЕ 3: email обязателен только если wantReply = true
  const validateEmail = (value, required = true) => {
    if (!value.trim()) {
      return required ? "Email обязателен для заполнения" : null;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return "Некорректный формат email";
    return null;
  };

  // ЗАДАНИЕ 2: валидация телефона
  const validatePhone = (value) => {
    if (!value.trim()) return "Телефон обязателен для заполнения";
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 11) return "Введите 11 цифр";
    return null;
  };

  // ЗАДАНИЕ 1: минимум 10, максимум 500 символов
  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    if (value.length > 500) return "Максимум 500 символов";
    return null;
  };

  // Универсальный объект валидаторов
  const validators = {
    name: validateName,
    email: (value) => validateEmail(value, wantReply), // зависит от чекбокса
    phone: validatePhone,
    message: validateMessage,
  };

  // --- Обработчик изменения поля (live-валидация) ---
  const handleChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(formatPhone(value)); // форматируем при вводе
        break;
      case "message":
        setMessage(value);
        break;
      default:
        break;
    }

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](value),
      }));
    }
  };

  // --- Обработчик потери фокуса (blur) ---
  const handleBlur = (field) => {
    const currentValue =
      field === "name" ? name :
      field === "email" ? email :
      field === "phone" ? phone :
      message;

    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](currentValue),
    }));
  };

  // --- Обработчик отправки формы ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email, wantReply),
      phone: validatePhone(phone),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // --- Динамические классы для инпутов ---
  const getInputClass = (field) => {
    const classes = ["field__input"];

    const value =
      field === "name" ? name :
      field === "email" ? email :
      field === "phone" ? phone :
      message;

    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field] && value) {
      classes.push("field__input--valid");
    }

    if (field === "message") {
      classes.push("field__input--textarea");
    }
    return classes.join(" ");
  };

  // --- Экран успеха ---
  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setWantReply(false);
            setErrors({ name: null, email: null, phone: null, message: null });
            setTouched({ name: false, email: false, phone: false, message: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      {/* Поле «Имя» */}
      <div className="field">
        <label htmlFor="name" className="field__label">
          Имя
        </label>
        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {touched.name && errors.name && (
          <span className="field__error">{errors.name}</span>
        )}
      </div>

      {/* Поле «Email» */}
      <div className="field">
        <label htmlFor="email" className="field__label">
          Email {wantReply && <span style={{ color: "#e5484d" }}>*</span>}
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && (
          <span className="field__error">{errors.email}</span>
        )}
      </div>

      {/* ЗАДАНИЕ 2: Поле «Телефон» */}
      <div className="field">
        <label htmlFor="phone" className="field__label">
          Телефон
        </label>
        <input
          id="phone"
          type="tel"
          className={getInputClass("phone")}
          value={phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          placeholder="+7 (___) ___-__-__"
        />
        {touched.phone && errors.phone && (
          <span className="field__error">{errors.phone}</span>
        )}
      </div>

      {/* ЗАДАНИЕ 3: Чекбокс «Хочу получить ответ» */}
      <div className="field field--checkbox">
        <label className="field__checkbox-label">
          <input
            type="checkbox"
            checked={wantReply}
            onChange={(e) => {
              const checked = e.target.checked;
              setWantReply(checked);
              // Пересчитываем ошибку email сразу
              if (touched.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: validateEmail(email, checked),
                }));
              }
            }}
          />
          <span>Хочу получить ответ</span>
        </label>
      </div>

      {/* Поле «Сообщение» */}
      <div className="field">
        <label htmlFor="message" className="field__label">
          Сообщение
        </label>
        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          rows={5}
          maxLength={500}
        />
        {/* ЗАДАНИЕ 1: счётчик символов */}
        <span
          className={`field__counter ${
            message.length > 450 ? "field__counter--warning" : ""
          }`}
        >
          {message.length} / 500
        </span>
        {touched.message && errors.message && (
          <span className="field__error">{errors.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;