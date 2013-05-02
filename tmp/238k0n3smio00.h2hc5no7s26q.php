<?php echo $this->render('header.html',$this->mime,get_defined_vars()); ?>
<script type="text/javascript" src="https://login.persona.org/include.js"></script>
<div id="loginbox">
    <div id="shine"></div>
    <?php if ($loggedin=='true'): ?>
        
            <div id="header3">
                <p id="left">
                    <span class="name"></span>
                </p>
                <p id="right">
                    <span money></span>
                    <button class="button" id="logout">Logout</button>
                </p>
            </div>
        
        <?php else: ?>
            <div id="header2">
                <p class="delegate">
                    <a href="#" id="facebook" class="button" title="Connect with Facebook"></a>
                    <a href="#" id="persona" class="button" title="Connect with Persona"></a>
                    <button id="opendialog" class="button">Login</button>
                </p>
            </div>
        
    <?php endif; ?>
</div>
<?php if ($loggedin=='true'): ?><?php else: ?>
<div id="logindialog">
    <table>
        <tr>
            <td>
                <h1>Login</h1>
                <form id="loginform">
                    <p>
                        <label>E-mail</label><input type="text" name="email" />
                    </p>
                    <p>
                        <label>Password</label><input type="password" name="pass" />
                    </p>
                    <p>
                        <input type="submit" class="button2" value="Login" />
                    </p>
                </form>
            </td>
            <td class="right">
                <h1>Sign up</h1>
                <form id="registerform">
                    <p>
                        <label>E-mail</label><input type="text" name="email" />
                    </p>
                    <p>
                        <label>Nickname</label><input type="text" name="nick" />
                    </p>
                    <p>
                        <label>Password</label><input type="password" name="pass1" />
                    </p>
                    <p>
                        <label>Confirm Password</label><input type="password" name="pass2" />
                    </p>
                    <p>
                        <input type="submit" class="button2" value="Register" />
                    </p>
                </form>
            </td>
        </tr>
    </table>
</div>
<?php endif; ?>
<div id="container">
	<div id="table">
		<div id="logo"></div>
		<div id="outline"></div>
        <div id="deck">
            <div id="shuffle">
                <div class="card"></div>
                <div class="card"></div>
                <div class="card"></div>
                <div class="card"></div>
                <div class="card"></div>
                <div class="card"></div>
                <div class="card"></div>
                <div class="card"></div>
            </div>
        </div>
        <div id="ui">
            <button class="player button3">2</button>
            <button class="player button3">3</button>
            <button class="player button3">4</button>
            <button class="player button3">5</button>
            <button class="player button3">6</button>
            <button class="player button3">7</button>
            <button class="player button3">8</button>
            <button class="player button3">9</button>
            <button class="player button3">10</button>
        </div>
        <div id="board">
        </div>
        <div id="deads">
        </div>
        <div id="hands">
        </div>
        <div id="reset">
            <button class="button3">Reset Game</button>
        </div>
        <div id="bet">
            <button class="button3">Place Bets</button>
        </div>
        <div id="bet_data">
            <p class="wager">
                <strong>Total Wager</strong>&nbsp;&nbsp;<span money>0</span>
            </p>
            <p class="balance">
                <strong>Balance</strong>&nbsp;&nbsp;<span money>0</span>
            </p>
            <p class="payout">
                <strong>Win/Loss</strong>&nbsp;&nbsp;<span money>0</span>
            </p>
        </div>
        <div id="bet_table">
            <table>
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>Wager<br />Pre-flop</th>
                        <th>Wager<br />Flop</th>
                        <th>Wager<br />Turn</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
                <tfoot>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><strong>Total Wagers:</strong></td>
                        <td class="totalWager"></td>
                        <td class="totalWager"></td>
                        <td class="totalWager"></td>
                    </tr>
                    <tr>
                        <td colspan=4 align=center><button class="place_bet">Submit your bets</button></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div id="message">Login or Sign up to start playing!</div>
    </div>
</div>
<?php echo $this->render('footer.html',$this->mime,get_defined_vars()); ?>