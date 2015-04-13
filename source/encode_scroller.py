import string
import json
import functools


scroller_text = (
    "         #   Hello guys!!!   #       "
    "PoliCTF  is coming 10/07/15 9:00UTC  ^P6"
    "        come back in a few weeks     "
    "     for news and registrations!   # ")

table = [
    ' ', '!', '"', 'sterlina', '$', '%', '&', '\'', '(', ')', '#', '+', ',', '-', '.', '/',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
    '><', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '/', ']', '^', '_',
    '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', 'upper_', '}', '~']

scroller_out = str()


quote_swap = functools.partial(
    string.translate, table=string.maketrans('\'"', '"\'')
)


def encode_single_quoted_js_string(s):
    return quote_swap(json.dumps(quote_swap(s)))


i = 0
while i < len(scroller_text):
    if scroller_text[i] == '^':
        scroller_out += '^P' + scroller_text[i + 2]
        i += 2
    else:
        scroller_out += chr(table.index(scroller_text[i])+0x20)
    i += 1


print 'var scroller_text =' + encode_single_quoted_js_string(scroller_out).replace('\\u00', '\\x') + ';'
