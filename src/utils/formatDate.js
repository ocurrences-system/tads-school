export const formatDate = (date) => {
    if (!date) return "";
    
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("pt-BR", options).format(new Date(date));
  };
  