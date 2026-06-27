import { companyInfo } from '@/constants/company'

interface CompanyInfoProps {
  className?: string
}

export default function CompanyInfo({ className = '' }: CompanyInfoProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {companyInfo.name}
        </h2>
        <p className="text-gray-600 text-lg">
          {companyInfo.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Контактная информация */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Контактная информация
          </h3>
          
          {companyInfo.addresses.map((location) => (
            <div key={location.name} className="flex items-start space-x-3">
              <div className="w-6 h-6 text-orange-500 mt-1">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">{location.name}:</p>
                <p className="text-gray-800 font-medium">{location.address}</p>
              </div>
            </div>
          ))}

          {companyInfo.phone && (
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 text-orange-500 mt-1">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Телефон:</p>
                <a 
                  href={`tel:${companyInfo.phone}`}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  {companyInfo.phone}
                </a>
              </div>
            </div>
          )}

          {companyInfo.email && (
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 text-orange-500 mt-1">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <a 
                  href={`mailto:${companyInfo.email}`}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  {companyInfo.email}
                </a>
              </div>
            </div>
          )}

          {companyInfo.workingHours && (
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 text-orange-500 mt-1">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600">Часы работы:</p>
                <p className="text-gray-800 font-medium">{companyInfo.workingHours}</p>
              </div>
            </div>
          )}
        </div>

        {/* Социальные сети */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Мы в социальных сетях
          </h3>
          
          <div className="space-y-3">
            {companyInfo.socialMedia.facebook && (
              <a
                href={companyInfo.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 text-blue-600">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Facebook</span>
              </a>
            )}

            {companyInfo.socialMedia.instagram && (
              <a
                href={companyInfo.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <div className="w-8 h-8 text-pink-600">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Instagram</span>
              </a>
            )}

            {companyInfo.socialMedia.website && (
              <a
                href={companyInfo.socialMedia.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 text-gray-600">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-800 font-medium">Веб-сайт</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
