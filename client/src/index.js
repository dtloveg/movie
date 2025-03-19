import React from 'react'
import { createRoot } from 'react-dom/client'
import { Online, Offline } from 'react-detect-offline'
import { Alert } from 'antd'

import GenresProvider from './components/context/genres-context'
import App from './components/app'

const root = createRoot(document.getElementById('root'))
root.render(
  <GenresProvider>
    <Online>
      <App />
    </Online>
    <Offline>
      <div>
        <Alert
          type="error"
          message={'Похоже, у вас нет подключения к интернету. Проверьте ваше соединение и попробуйте снова'}
          style={{ maxWidth: '1010px', textAlign: 'center' }}
        />
      </div>
    </Offline>
  </GenresProvider>
)
