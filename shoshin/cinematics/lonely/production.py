import pygame, sys
import numpy as np
import subprocess
import time
import json
from math import sqrt
from timeit import default_timer as timer


def draw_background ():
	""" Draw a horizontal-gradient filled rectangle covering <target_rect> """
	target_rect = pygame.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
	color_rect = pygame.Surface( (2,2) )
	pygame.draw.line( color_rect, BG_TOP_COLOR,  (0,0), (1,0) ) # top color line
	pygame.draw.line( color_rect, BG_BOTTOM_COLOR, (0,1), (1,1) ) # bottom color line
	color_rect = pygame.transform.smoothscale( color_rect, (target_rect.width,target_rect.height ) )  # stretch
	screen.blit( color_rect, target_rect ) # paint

# # text box initialization
def update_game_message (message):
	font = pygame.font.Font(None, 22)
	text = font.render(message, 1, (255, 255, 255))
	text_rect = text.get_rect(center =(SCREEN_WIDTH / 2, SCREEN_HEIGHT + GAME_TEXT_HEIGHT/2))
	screen.fill ((30, 30, 30), (0, SCREEN_HEIGHT, SCREEN_WIDTH, GAME_TEXT_HEIGHT))
	screen.blit(text, text_rect)
	pygame.display.update()

# def update_stat_message (message):
# 	font = pygame.font.Font(None, 14)
# 	text = font.render(message, 1, (255, 255, 255))
# 	text_rect = text.get_rect(center =(SCREEN_WIDTH / 2, SCREEN_HEIGHT + GAME_TEXT_HEIGHT + STAT_TEXT_HEIGHT/2))
# 	screen.fill ((1, 1, 1), (0, SCREEN_HEIGHT+GAME_TEXT_HEIGHT, SCREEN_WIDTH, STAT_TEXT_HEIGHT))
# 	screen.blit(text, text_rect)
# 	pygame.display.update()

# redraw the screen and the mass at new x location
def update_figures(ball_xy_s):

	SCALE = 1
	draw_background ()
	n_ball = len(ball_xy_s)

	# enqueue & dequeue; leave N circles in trail; insert from head
	N_TRAIL_CIRCLES = 1
	if len(ball_queue_s[0])==N_TRAIL_CIRCLES:
		for i in range(n_ball):
			ball_queue_s[i] = [ball_xy_s[i]] + ball_queue_s[i][0:-1]
	else:
		for i in range(n_ball):
			ball_queue_s[i] = [ball_xy_s[i]] + ball_queue_s[i]

	# transform from simulation coordinate to visualization
	f_transform_x = lambda x : x
	f_transform_y = lambda y : SCREEN_HEIGHT - y

	# draw the point mass
	for i in range(n_ball):
		circle_img = pygame.Surface((BALL_RADIUS*2*SCALE,BALL_RADIUS*2*SCALE))
		pygame.draw.circle(circle_img, BALL_COLOR_S[i], (BALL_RADIUS*SCALE,BALL_RADIUS*SCALE), BALL_RADIUS*SCALE)
		circle_img.set_colorkey(0)
		for j in range(len(ball_queue_s[i])):
			x = f_transform_x (ball_queue_s[i][j][0])
			y = f_transform_y (ball_queue_s[i][j][1])

			if j==0:
				circle_img.set_alpha(255)
			else:
				circle_img.set_alpha(250 * ( 1-j**2/N_TRAIL_CIRCLES**2 ))
			screen.blit(circle_img, (x-BALL_RADIUS*SCALE,y-BALL_RADIUS*SCALE)) # coordinate is top-left of circle_img

	pygame.display.update()

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
SCREEN_HEIGHT_TOTAL = SCREEN_HEIGHT + GAME_TEXT_HEIGHT

BG_TOP_COLOR = COLOR_CREAM # (132,203,185)
BG_BOTTOM_COLOR = COLOR_CREAM # (201,230,225)

pygame.init()
screen = pygame.display.set_mode( (SCREEN_WIDTH, SCREEN_HEIGHT_TOTAL) )
draw_background ()
update_game_message ('Shoshin milestone #1: Lonely')
pygame.display.set_caption( 'Game Testing' )

clock = pygame.time.Clock()

f = open('../../artifacts/test_engine.json')
json_str = json.load (f)
data = json.loads (json_str)
frames = data ['agent_0']
n_frames = len (frames)

print (data)

SPRITES = {
	0  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_0.png'),
	1  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_1.png'),
	2  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_2.png'),
	3  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_3.png'),
	4  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_4.png'),
	5  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_5.png'),
	6  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_6.png'),
	7  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_7.png'),
	8  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_8.png'),
	9  : pygame.image.load('../assets/kyo/idle/kyo_idle_frame_9.png'),
	10 : pygame.image.load('../assets/kyo/punch/kyo_punch_frame_0.png'),
	11 : pygame.image.load('../assets/kyo/punch/kyo_punch_frame_1.png'),
	12 : pygame.image.load('../assets/kyo/punch/kyo_punch_frame_2.png'),
	13 : pygame.image.load('../assets/kyo/punch/kyo_punch_frame_3.png'),
	14 : pygame.image.load('../assets/kyo/punch/kyo_punch_frame_4.png'),
	15 : pygame.image.load('../assets/kyo/punch/kyo_punch_frame_5.png'),
	16 : pygame.image.load('../assets/kyo/punch/kyo_punch_frame_6.png')
}

def draw_sprite (sprite, x, y):
	screen.blit (
		sprite,
		(x + 0.5*SCREEN_WIDTH, SCREEN_HEIGHT - y - sprite.get_height())
	)

idx = 0
while True:

	#
	# Get agent state and location from frames
	#
	state = frames[idx]['state']
	[x, y] = frames[idx]['loc']

	#
	# Render background and agent
	#
	draw_background ()
	draw_sprite (SPRITES[state], x, y)
	pygame.display.update()

	#
	# Delay for frame period and increment frame index
	#
	time.sleep(42 / 1000) # 1s / 24 ~= 42ms
	idx = (idx + 1) % n_frames

