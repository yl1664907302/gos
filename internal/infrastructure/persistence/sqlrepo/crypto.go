package sqlrepo

import "gos/internal/support/secure"

func encryptStoredSecret(value string) (string, error) {
	return secure.EncryptString(value)
}

func decryptStoredSecret(value string) (string, error) {
	return secure.DecryptString(value)
}
