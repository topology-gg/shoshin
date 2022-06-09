import pygame, sys
import numpy as np
import subprocess
import time
import json
from math import sqrt
from timeit import default_timer as timer

PRIME = 3618502788666131213697322783095070105623107215331596699973092056135872020481
PRIME_HALF = PRIME//2

# FRAME_PERIOD = 0.7
FRAME_PERIOD = 0.1

def draw_background ():
	""" Draw a horizontal-gradient filled rectangle covering <target_rect> """
	target_rect = pygame.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
	color_rect = pygame.Surface( (2,2) )
	pygame.draw.line( color_rect, BG_TOP_COLOR,  (0,0), (1,0) ) # top color line
	pygame.draw.line( color_rect, BG_BOTTOM_COLOR, (0,1), (1,1) ) # bottom color line
	color_rect = pygame.transform.smoothscale( color_rect, (target_rect.width,target_rect.height ) )  # stretch
	screen.blit( color_rect, target_rect ) # paint


def update_game_message (message):
	font = pygame.font.Font(None, 22)
	text = font.render(message, 1, (255, 255, 255))
	text_rect = text.get_rect(center =(SCREEN_WIDTH / 2, SCREEN_HEIGHT + GAME_TEXT_HEIGHT/2))
	screen.fill ((30, 30, 30), (0, SCREEN_HEIGHT, SCREEN_WIDTH, GAME_TEXT_HEIGHT))
	screen.blit(text, text_rect)
	# pygame.display.update()


def update_stat_message (message):
	font = pygame.font.Font(None, 22)
	text = font.render(message, 1, (255, 255, 255))
	text_rect = text.get_rect(center =(SCREEN_WIDTH / 2, SCREEN_HEIGHT + GAME_TEXT_HEIGHT + STAT_TEXT_HEIGHT/2))
	screen.fill ((1, 1, 1), (0, SCREEN_HEIGHT+GAME_TEXT_HEIGHT, SCREEN_WIDTH, STAT_TEXT_HEIGHT))
	screen.blit(text, text_rect)
	# pygame.display.update()


def adjust_from_felt (felt):
	if felt > PRIME_HALF:
		return felt - PRIME
	else:
		return felt

def adjust_from_felt_array (felt_array):
	return [adjust_from_felt (felt) for felt in felt_array]

# scene setup
SCREEN_WIDTH = 600
SCREEN_CENTER = SCREEN_WIDTH/2
SCREEN_HEIGHT = 200

COLOR_LEMON = (255,231,107)
COLOR_TAN = (240,143,62)
COLOR_BURNT = (229,78,48)
COLOR_CREAM = (255,248,211)
COLOR_GRAY = (85,74,82)

GAME_TEXT_HEIGHT = 75
STAT_TEXT_HEIGHT = 75
SCREEN_HEIGHT_TOTAL = SCREEN_HEIGHT + GAME_TEXT_HEIGHT + STAT_TEXT_HEIGHT

BG_TOP_COLOR = COLOR_CREAM # (132,203,185)
BG_BOTTOM_COLOR = COLOR_CREAM # (201,230,225)

#
# Initialize pygame
#
pygame.init()
pygame.display.set_caption( 'Game Testing' )
screen = pygame.display.set_mode( (SCREEN_WIDTH, SCREEN_HEIGHT_TOTAL) )
draw_background ()
update_game_message ('Shoshin milestone #5: Clash')
update_stat_message('')

pygame.display.update()


#
# Import fight record
#
f = open('artifacts/test_engine.json')
json_str = json.load (f)
record = json.loads (json_str)
n_frames = len (record['agent_0'])

for frame in record ['agent_0']:
	print (frame['object_state'], end=' ')
print()
for frame in record ['agent_1']:
	print (frame['object_state'], end=' ')
print()

SPRITES = {
	0  : pygame.image.load('cinematics/assets/kyo/idle/frame_0.png'),
	1  : pygame.image.load('cinematics/assets/kyo/idle/frame_1.png'),
	2  : pygame.image.load('cinematics/assets/kyo/idle/frame_2.png'),
	3  : pygame.image.load('cinematics/assets/kyo/idle/frame_3.png'),
	4  : pygame.image.load('cinematics/assets/kyo/idle/frame_4.png'),
	5  : pygame.image.load('cinematics/assets/kyo/idle/frame_5.png'),
	6  : pygame.image.load('cinematics/assets/kyo/idle/frame_6.png'),
	7  : pygame.image.load('cinematics/assets/kyo/idle/frame_7.png'),
	8  : pygame.image.load('cinematics/assets/kyo/idle/frame_8.png'),
	9  : pygame.image.load('cinematics/assets/kyo/idle/frame_9.png'),

	10 : pygame.image.load('cinematics/assets/kyo/punch/frame_0.png'),
	11 : pygame.image.load('cinematics/assets/kyo/punch/frame_1.png'),
	12 : pygame.image.load('cinematics/assets/kyo/punch/frame_2.png'),
	13 : pygame.image.load('cinematics/assets/kyo/punch/frame_3.png'),
	14 : pygame.image.load('cinematics/assets/kyo/punch/frame_4.png'),
	15 : pygame.image.load('cinematics/assets/kyo/punch/frame_5.png'),
	16 : pygame.image.load('cinematics/assets/kyo/punch/frame_6.png'),

	17 : pygame.image.load('cinematics/assets/kyo/hit/frame_0.png'),
	18 : pygame.image.load('cinematics/assets/kyo/hit/frame_1.png'),
	19 : pygame.image.load('cinematics/assets/kyo/hit/frame_2.png'),
	20 : pygame.image.load('cinematics/assets/kyo/hit/frame_3.png'),

	21 : pygame.image.load('cinematics/assets/kyo/jump/frame_0.png'),
	22 : pygame.image.load('cinematics/assets/kyo/idle/frame_5.png'),
	23 : pygame.image.load('cinematics/assets/kyo/jump/frame_0.png'),
	24 : pygame.image.load('cinematics/assets/kyo/idle/frame_5.png'),
	25 : pygame.image.load('cinematics/assets/kyo/jump/frame_0.png'),

	26 : pygame.image.load('cinematics/assets/kyo/punch/frame_5.png'),
	27 : pygame.image.load('cinematics/assets/kyo/punch/frame_3.png'),
	28 : pygame.image.load('cinematics/assets/kyo/punch/frame_5.png'),
	29 : pygame.image.load('cinematics/assets/kyo/punch/frame_3.png'),
	30 : pygame.image.load('cinematics/assets/kyo/punch/frame_5.png'),
	31 : pygame.image.load('cinematics/assets/kyo/punch/frame_3.png'),

	32 : pygame.image.load('cinematics/assets/kyo/knocked/frame_0.png'),
	33 : pygame.image.load('cinematics/assets/kyo/knocked/frame_1.png'),
	34 : pygame.image.load('cinematics/assets/kyo/knocked/frame_2.png'),
	35 : pygame.image.load('cinematics/assets/kyo/knocked/frame_3.png'),
	36 : pygame.image.load('cinematics/assets/kyo/knocked/frame_4.png'),
	37 : pygame.image.load('cinematics/assets/kyo/knocked/frame_5.png'),
	38 : pygame.image.load('cinematics/assets/kyo/knocked/frame_6.png'),
	39 : pygame.image.load('cinematics/assets/kyo/knocked/frame_7.png'),
	40 : pygame.image.load('cinematics/assets/kyo/knocked/frame_8.png'),
	41 : pygame.image.load('cinematics/assets/kyo/knocked/frame_9.png'),
	42 : pygame.image.load('cinematics/assets/kyo/knocked/frame_10.png'),
	43 : pygame.image.load('cinematics/assets/kyo/knocked/frame_11.png'),

	44 : pygame.image.load('cinematics/assets/kyo/punch/frame_2.png')
}

STATES_HIT = [
	17,18,19,20
]

STATES_PUNCH = [
	10,11,12,13,14,15,16,
	26,27,28,29,30,31,
	44
]

def draw_character (frame, flip):

	#
	# Extract info from frame
	#
	state = frame ['object_state']
	counter = frame ['object_counter']
	[x, y] = frame ['character_state']['pos']

	#
	# Adjust from felt
	#
	[x, y] = [adjust_from_felt(x), adjust_from_felt(y)]

	#
	# Convert info into render-view info
	#
	sprite = SPRITES[ state + counter ]
	char_x = x + 0.5*SCREEN_WIDTH
	char_y = SCREEN_HEIGHT - y - sprite.get_height()

	#
	# Adjustment for hit sprite's x location
	#
	if flip == 0: # not flipped
		if state in STATES_HIT: ## adjust for hit sprite shifts
			char_x -= 20

		if state in [21,23,25]: ## adjust for jump sprite shifts
			char_x -= 20

	else: # flipped
		if state in STATES_PUNCH: ## adjust for punch sprite shifts when mirrored horizontally
			char_x -=47

	# print(state, char_x, char_y)
	#
	# Draw character sprite
	#
	screen.blit (
		pygame.transform.flip (sprite, flip, False),
		(char_x, char_y)
	)


def draw_debug (frame, flip):

	#
	# Extract info from frame
	#
	state = frame ['object_state']
	[action_x, action_y] = frame ['hitboxes']['action']['origin']
	[action_w, action_h] = frame ['hitboxes']['action']['dimension']
	[body_x, body_y] = frame ['hitboxes']['body']['origin']
	[body_w, body_h] = frame ['hitboxes']['body']['dimension']
	integrity = frame['character_state']['int']

	#
	# Adjust from felt
	#
	[action_x, action_y] = adjust_from_felt_array ([action_x, action_y])
	[action_w, action_h] = adjust_from_felt_array ([action_w, action_h])
	[body_x, body_y] = adjust_from_felt_array ([body_x, body_y])
	[body_w, body_h] = adjust_from_felt_array ([body_w, body_h])

	#
	# Convert info into render-view info
	#
	action_x = action_x + 0.5*SCREEN_WIDTH
	body_x   = body_x + 0.5*SCREEN_WIDTH
	action_y = SCREEN_HEIGHT - action_y - action_h
	body_y   = SCREEN_HEIGHT - body_y - body_h

	# print (f'state: {state}, action: ({action_x}, {action_y}) / body: ({body_x}, {body_y})')

	#
	# Draw body hitbox
	# credit for drawing transparent objects:
	# - https://stackoverflow.com/questions/6339057/draw-a-transparent-rectangles-and-polygons-in-pygame
	#
	body_hitbox = pygame.Surface( (body_w, body_h), pygame.SRCALPHA )   # per-pixel alpha
	body_hitbox.fill( (255,231,107,150) )
	screen.blit(
		pygame.transform.flip (body_hitbox, flip, False),
		(body_x, body_y)
	)

	#
	# draw action hitbox
	#
	action_hitbox = pygame.Surface( (action_w, action_h), pygame.SRCALPHA )   # per-pixel alpha
	action_hitbox.fill( (229,78,48,150) )

	# if flip == 0: ## not flipped
	# 	offset = BODY_HITBOX_W
	# else:
	# 	offset = -PUNCH_HITBOX_W

	screen.blit(action_hitbox, (action_x, action_y))
	# print (f'action hitbox (x,y,w,h) = ({action_x}, {action_y}, {action_w}, {action_h})')

#
# Main loop
#
idx = 0
while True:

	#
	# Draw background (reset scene)
	#
	draw_background ()

	for agent_idx in [0,1]:
		frames = record [f'agent_{agent_idx}']
		frame = frames [idx]

		#
		# Draw agent
		#
		draw_character (frame, flip=agent_idx)

		#
		# Draw debug view
		#
		# print(agent_idx)
		draw_debug (frame, flip=agent_idx)
		# print()


	# int_0 = record['agent_0'][idx]['character_state']['int']
	# int_1 = record['agent_1'][idx]['character_state']['int']
	obj_0 = record['agent_0'][idx]['object_state']
	obj_1 = record['agent_1'][idx]['object_state']
	# update_stat_message(f'player 0 integrity : {int_0} / player 1 integrity : {int_1}')
	update_stat_message(f'player 0 object_state : {obj_0} / player 1 object_state : {obj_1}')

	#
	# Pygame update scene
	#
	pygame.display.update()

	#
	# Delay for frame period and increment frame index
	#
	# time.sleep (42 / 1000) # 1s / 24 ~= 42ms
	time.sleep (FRAME_PERIOD)
	idx = (idx + 1) % n_frames

